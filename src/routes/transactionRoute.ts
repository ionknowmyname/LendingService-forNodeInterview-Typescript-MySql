import { Router, Request, Response } from 'express'
import pool from '../config/dbConnection';
import authenticate from '../config/authentication';
import { randomUUID } from 'crypto';
import findUserIdFromEmail from '../utils/userUtils';
import checkWalletExists from '../utils/userUtils';


const transactionRouter = Router();

transactionRouter.post('/transfer', authenticate, (req: Request, res: Response) => { 
  
    // console.log("(<any>req).user from Books: " + (<any>req).user);
    const currentUserEmail =  (<any>req).user;
    const currentUserId = findUserIdFromEmail(currentUserEmail);

    const { transactionType, 
        transactionAmount, 
        senderWalletId, 
        receiverWalletId, 
        receiverBankAccount } = req.body;

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
  
        // make sure sender wallet exist
        // const sqlQuery = 'SELECT * FROM wallets WHERE wallet_id IN (?, ?)';
        const sqlQuery = 'SELECT * FROM wallets WHERE wallet_id=?';

        pool.query(sqlQuery, [senderWalletId], (err: any, rows: any) => {
            if(err){
                console.log('Encountered an error: ', err);
                conn.release();
        
                return res.send({
                    success: false,
                    statusCode: 400
                });      
            }
    
            if(rows.length < 1){   
                conn.release();

                return res.send({
                    message: 'Sender wallet not found',
                    statusCode: 404,
                });
            } 

            // make sure logged in user is the owner of sender wallet
            if(rows[0].user_id !== currentUserId){   
                conn.release();

                return res.send({
                    message: 'Logged in User cannot transact with this wallet',
                    statusCode: 403,
                });
            } 

            // make sure receiver exists 
            const walletExists: boolean = checkWalletExists(receiverWalletId);

            // no need to check if bank account exists, 3rd party integration would handle that

            if(walletExists){   
                // create transaction
                const sqlQuery = `INSERT INTO transactions(transaction_id, transaction_type, transaction_amount, 
                    user_id, sender_wallet_id, receiver_wallet_id, receiver_bank_account) VALUES (?,?,?,?,?,?,?)`;

                pool.query(sqlQuery, [randomUUID(), transactionType, transactionAmount, currentUserId, senderWalletId, 
                    receiverWalletId, receiverBankAccount], (err: any, rows: any) => {
                        
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

export default transactionRouter;