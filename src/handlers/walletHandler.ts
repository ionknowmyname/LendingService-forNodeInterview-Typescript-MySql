import { Request, Response } from 'express'
import pool from '../config/dbConnection';
const uuid = require('uuid').v4

const createWallet = (req: Request, res: Response) => { 
  
    // console.log("(<any>req).user from walletRoute: " + (<any>req).user);
    const currentUserEmail =  (<any>req).user;

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

    })

    pool.query('SELECT * FROM users WHERE email=?', [currentUserEmail], (err: any, rows: any) => {
        if(err){
            console.log('Encountered an error: ', err)
    
            return res.send({
                success: false,
                statusCode: 400
            });      
        }

        if(rows.length < 1){  

            return res.send({
                message: 'User not found',
                statusCode: 404,
            });
        } else {
            // User exists, create wallet for user
            const userId = rows[0].user_id;
            const searchQuery = 'SELECT * FROM wallets WHERE user_id=?';

            pool.query(searchQuery, [userId], (err: any, rows: any) => {
                if(err){
                    console.log('Encountered an error: ', err);
            
                    return res.send({
                        success: false,
                        statusCode: 400
                    });      
                }

                // add unique constraint to DB for user_id
                if(rows.length >= 1){   

                    return res.send({
                        message: 'User already has a wallet',
                        statusCode: 409,
                    });
                }

                const sqlQuery = `INSERT INTO wallets(wallet_id, user_id, balance) VALUES (?,?,?)`;
                // const { walletId, userId, balance } = req.body;

                pool.query(sqlQuery, [uuid(), userId, 0.0], (err: any, rows: any) => {
                    if(err){
                        console.log('Encountered an error: ', err);
                
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
            
                    // pool.query closes connection by itself  
                });

            });

        }

    });
      
}

export default createWallet;