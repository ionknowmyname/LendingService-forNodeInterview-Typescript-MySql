import { Request, Response } from 'express'
import pool from '../config/dbConnection';
const uuid = require('uuid').v4
import findUserIdFromEmail from '../utils/userUtils';
import getWalletByWalletId from '../utils/walletUtils';

const createTransfer = async (req: Request, res: Response) => { 
  
    // console.log("(<any>req).user from Books: " + (<any>req).user);
    const currentUserEmail =  (<any>req).user;

    const currentUserId = await findUserIdFromEmail(currentUserEmail);
    console.log("currentUserId from transactionRoute  --> " + currentUserId);

    const { transactionType, 
        transactionAmount, 
        senderWalletId, 
        receiverWalletId, 
        receiverBankAccount 
    } = req.body;

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

        pool.query(sqlQuery, [senderWalletId], async (err: any, rows: any) => {
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
            let receiverWalletDetails: any;

            try {
                receiverWalletDetails = await getWalletByWalletId(receiverWalletId);
            } catch (error) {
                console.log('Entered an error --> ', error);
                res.send({
                    success: false,
                    statusCode: 500,
                    message: 'Error retrieving receiver wallet details'
                }) 
                
                return;
            }
             
            console.log("receiverWalletDetails in transactionRoute --> " + receiverWalletDetails.wallet_id);
            console.log("receiverWalletDetails in transactionRoute --> " + receiverWalletDetails.user_id);
            console.log("receiverWalletDetails in transactionRoute --> " + receiverWalletDetails.balance);
            
            const { wallet_id, user_id, balance } = receiverWalletDetails;

            // no need to check if bank account exists, 3rd party integration would handle that

            if(wallet_id !== null){   
                // check if wallet balance is sufficient 
                
                const senderCurrentBalance = rows[0].balance;

                if(senderCurrentBalance < transactionAmount){
                    conn.release();

                    return res.send({
                        message: 'You do not have sufficient balance to make this transaction',
                        statusCode: 403,
                    });
                }

                // create transaction
                const sqlQuery2 = `INSERT INTO transactions(transaction_id, transaction_type, transaction_amount, 
                    user_id, sender_wallet_id, receiver_wallet_id, receiver_bank_account) VALUES (?,?,?,?,?,?,?)`;

                pool.query(sqlQuery2, [uuid(), transactionType, transactionAmount, currentUserId, senderWalletId, 
                    receiverWalletId, receiverBankAccount], (err: any, rows: any) => { 

                    if(err){
                        console.log('Encountered an error: ', err);
                        conn.release();
                
                        return res.send({
                            success: false,
                            statusCode: 400
                        });      
                    }

                    // update sender wallet balance
                    const sqlQuery3 = `UPDATE wallets SET balance=? WHERE wallet_id=?`;
                    const senderNewBalance = senderCurrentBalance - transactionAmount; 
                    
                    pool.query(sqlQuery3, [senderNewBalance, senderWalletId], (err: any, rows: any) => {
                        if(err){
                            console.log('Encountered an error: ', err);
                            conn.release();
                    
                            return res.send({
                                success: false,
                                statusCode: 400
                            });      
                        }

                        // nothing was updated, throw error
                        if(rows.affectedRows < 1){  
                            conn.release();
            
                            return res.send({
                                message: 'Wallet balance update failed',
                                statusCode: 400,
                            });
                        }

                        // don't release connection yet
                    });


                    // update receiver balance
                    const receiverNewBalance = balance + transactionAmount;

                    pool.query(sqlQuery3, [receiverNewBalance, wallet_id], (err: any, rows: any) => {
                        if(err){
                            console.log('Encountered an error: ', err);
                            conn.release();
                    
                            return res.send({
                                success: false,
                                statusCode: 400
                            });      
                        }

                        // nothing was updated, throw error
                        if(rows.affectedRows < 1){  
                            conn.release();
            
                            return res.send({
                                message: 'Wallet balance update failed',
                                statusCode: 400,
                            });
                        }

                        // don't release connection yet
                    });


                    res.send({
                        message: 'Transaction successful',
                        statusCode: 200,
                        // data: rows
                    });
            
                    conn.release();   // close connection
                });
            } else {
                conn.release();

                return res.send({
                    message: 'Receiver wallet does not exist',
                    statusCode: 404,
                });
            }
            
        });
      
    });
}

export default createTransfer;