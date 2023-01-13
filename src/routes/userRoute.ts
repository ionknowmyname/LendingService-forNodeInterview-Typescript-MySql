import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/dbConnection';
import poolConnection from '../config/poolConnect';
import generateToken from '../config/generateToken';
import authenticate from '../config/authentication';
var cacheService = require("express-api-cache");
var cache = cacheService.cache;
const uuid = require('uuid').v4
// import uuid from 'uuid';
import { randomUUID } from 'crypto';


const saltround = 10;
const userRouter = Router();

userRouter.get('/', (req: Request, res: Response) => {
    return res.json("OK");
});

userRouter.get('/all', authenticate, cache("10 minutes"), (req: Request, res: Response) => {

    pool.connect((err: any, conn: any) => {
        if(err){
            console.log('Entered an error: ', err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'Error during connection'
            }) 
            
            return;
        }

        console.log('connected on threadId --> ' + pool.threadId);

    });

    const sqlQuery = 'SELECT id, email, phone, createdAt FROM users';
    pool.query(sqlQuery, (err: any, rows: any) => {
        if(err){
            console.log('Encountered an error: ', err);
            pool.end();
    
            return res.send({
                success: false,
                statusCode: 400
            });      
        }

        if(rows.length < 1){  // DB table is empty
            return res.send({
                message: 'No Data found',
                statusCode: 404,
            });
        }

        res.send({
            message: 'Successul',
            statusCode: 200,
            data: rows
        });

        pool.end();   // close connection
    });

});
  
userRouter.post('/register', (req: Request, res: Response) => {
  
    pool.connect((err: any, conn: any) => {
        if(err){
            console.log('Entered an error: ', err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'Error during connection'
            }) 
            
            return;
        }

        bcrypt.hash(req.body.password, saltround, (error: any, hash: string) => {
            if(error){
                console.log('Entered an error: ', error);
                res.send({
                    success: false,
                    statusCode: 500,
                    message: 'Error during password encryption'
                }) 
                
                return;
            } else {
                // console.log('req.body: ' + req.body);
                let sqlQuery = `call registeruser(?,?,?,?)`;  // stored procedure on phpmyadmin
                let sqlQuery2 = `INSERT INTO users (user_id, email, phone, password) VALUES (?,?,?,?)`;
                const { email, phone } = req.body;
        
                pool.query(sqlQuery2, [uuid(), email, phone, hash], (err: any, rows: any) => {
                    
                    if(err){

                        if(err.code === "ER_DUP_ENTRY"){
                            console.log('Encountered an error: ', err);
                            pool.end();
                    
                            return res.send({
                                success: false,
                                statusCode: 409,
                                error: "Email aready exists"
                            });      
                        }
                        
                        console.log('Encountered an error: ', err);
                        pool.end();                       
                
                        return res.send({
                            success: false,
                            statusCode: 400,
                            error: "Error while Creating user, Try again"
                        });      
                    }
            
                    res.send({
                        message: 'Successul',
                        statusCode: 200,
                        // data: rows
                    });
            
                    pool.end();  // close connection
                });
            }

        });  
      
    });
});

userRouter.post('/login', async (req: Request, res: Response) => {
  
    // pool.connect((err: any, conn: any) => {
    //     if(err){
    //         console.log('Entered an error: ', err);
    //         res.send({
    //             success: false,
    //             statusCode: 500,
    //             message: 'Error during connection'
    //         }) 
            
    //         return;
    //     }

    //     console.log('connected on threadId --> ' + pool.threadId);

    // });

    await poolConnection;

    pool.query('SELECT password FROM users WHERE email=?', [req.body.email], (err: any, rows: any) => {
        if(err){
            console.log('Encountered an error: ', err);
            pool.end();
    
            return res.send({
                success: false,
                statusCode: 400
            });      
        }

        // console.log("hashed password from DB --> " + rows[0].password);
        const passwordfromDB = rows[0].password;
        bcrypt.compare(req.body.password, passwordfromDB, (err, result) => {
            if(err){ 
                console.log('Encountered an error: ', err);
                pool.end();

                res.send({
                    message: "Failed during password validation",
                    statusCode: 500
                    // data: err  // don't return bcrypt error to client
                })

                return;
            }

            if(result){
                res.send({
                    message: "Success",
                    statusCode: 200,
                    data: { token: generateToken(req.body.email) }
                });
            } else {                    
                res.send({
                    message: "Failed",
                    statusCode: 500,
                    // data: result
                });

                return;
            }
        });
        
        pool.end();  // close connection
    });
});


export default userRouter;