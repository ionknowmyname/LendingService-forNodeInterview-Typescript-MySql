import { Router, Request, Response } from 'express'
import pool from '../config/dbConnection';
import authenticate from '../config/authentication';


const walletRouter = Router();

walletRouter.post('/create', authenticate, (req: Request, res: Response) => { 
  
    // console.log("(<any>req).user from Books: " + (<any>req).user);
    const currentUserEmail =  (<any>req).user;

    pool.getConnection((err: any, conn: any) => {
        if(err){
            console.log('Entered an error: ', err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'Error during connection'
            }) 
            
            return;
        }

        console.log('isbn from req.body: ' + req.body.isbn);
  
        pool.query('SELECT * FROM books WHERE isbn=?', [req.body.isbn], (err: any, rows: any) => {
            if(err){
                console.log('Encountered an error: ', err);
                conn.release();
        
                return res.send({
                    success: false,
                    statusCode: 400
                });      
            }
    
            if(rows.length >= 1){   // ISBN already exists
                conn.release();

                return res.send({
                    message: 'Book with ISBN already exists',
                    statusCode: 409,
                });
            } else {
                const sqlQuery = `INSERT INTO books(isbn, title, author, year_published) VALUES (?,?,?,?)`;
                const { isbn, title, author, yearPublished } = req.body;

                pool.query(sqlQuery, [isbn, title, author, yearPublished], (err: any, rows: any) => {
                    if(err){
                        console.log('Encountered an error: ', err);
                        conn.release();
                
                        return res.send({
                            success: false,
                            statusCode: 400
                        });      
                    }
            
                    res.send({
                        message: 'Successul',
                        statusCode: 200,
                        // data: rows
                    });
            
                    conn.release();   // close connection
                });
            }
    
        });
      
    });
}); 


export default walletRouter;