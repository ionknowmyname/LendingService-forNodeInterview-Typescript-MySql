import { Request, Response } from 'express'
import pool from '../config/dbConnection';
const uuid = require('uuid').v4
import findUserIdFromEmail from '../utils/userUtils';
import { getWalletByWalletId, updateWalletBalance } from '../utils/walletUtils';

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

    // make sure sender wallet exist

    // const sqlQuery = 'SELECT * FROM wallets WHERE wallet_id IN (?, ?)';
    const sqlQuery = 'SELECT * FROM wallets WHERE wallet_id=?';

    pool.query(sqlQuery, [senderWalletId], async (err: any, rows: any) => {
        if(err){
            console.log('Encountered an error: ', err);
    
            return res.send({
                success: false,
                statusCode: 400
            });      
        }

        if(rows.length < 1){   

            return res.send({
                message: 'Sender wallet not found',
                statusCode: 404,
            });
        }

        // make sure logged in user is the owner of sender wallet
        if(rows[0].user_id !== currentUserId){   

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
            
        console.log("receiverWalletDetailsWalletId in transactionHandler --> " + receiverWalletDetails.wallet_id);
        console.log("receiverWalletDetailsUserId in transactionHandler --> " + receiverWalletDetails.user_id);
        console.log("receiverWalletDetailsBalance in transactionHandler --> " + receiverWalletDetails.balance);
        
        const { wallet_id, user_id, balance } = receiverWalletDetails;

        // no need to check if bank account exists, 3rd party integration would handle that

        if(wallet_id !== null){   
            // check if wallet balance is sufficient 
            
            const senderCurrentBalance = rows[0].balance;

            if(senderCurrentBalance < transactionAmount){

                return res.send({
                    message: 'You do not have sufficient balance to make this transaction',
                    statusCode: 403,
                });
            }

            pool.beginTransaction((err: any) => {


                // create transaction
                const sqlQuery2 = `INSERT INTO transactions(transaction_id, transaction_type, transaction_amount, 
                    user_id, sender_wallet_id, receiver_wallet_id, receiver_bank_account) VALUES (?,?,?,?,?,?,?)`;

                pool.query(sqlQuery2, [uuid(), transactionType, transactionAmount, currentUserId, senderWalletId, 
                    receiverWalletId, receiverBankAccount], async (err: any, rows: any) => { 

                    if(err){
                        console.log('Encountered an error: ', err);
                
                        pool.rollback(() => {
                            // throw err;

                            return res.send({
                                success: false,
                                statusCode: 400
                            });
                        });
                        
                        // return res.send({
                        //     success: false,
                        //     statusCode: 400
                        // });      
                    }

                    // update sender wallet balance

                    let updateSenderWalletBalanceResult: any;

                    try {
                        updateSenderWalletBalanceResult = await updateWalletBalance(senderCurrentBalance, transactionAmount, senderWalletId, "sender");
                        console.log('updateSenderWalletBalanceResult in transaction handler --> ', updateSenderWalletBalanceResult);

                        if(updateSenderWalletBalanceResult !== 1){
                            console.log('Error from updating Sender wallet balance');

                            pool.rollback(() => {
                                // throw err;
    
                                return res.send({
                                    success: false,
                                    statusCode: 400,
                                    message: 'Error from updating Sender wallet balance'
                                });
                            });


                            // res.send({
                            //     success: false,
                            //     statusCode: 400,
                            //     message: 'Error from updating Sender wallet balance'
                            // }) 
                            
                            // return;
                        }
                    } catch (error) {
                        console.log('Entered an error --> ', error);
                        res.send({
                            success: false,
                            statusCode: 500,
                            message: 'Error retrieving update wallet balance status for sender'
                        }) 
                        
                        return;
                    }

                    
                    // update receiver balance

                    let updateReceiverWalletBalanceResult: any;

                    try {
                        updateReceiverWalletBalanceResult = await updateWalletBalance(balance, transactionAmount, receiverWalletId, "receiver");
                        console.log('updateReceiverWalletBalanceResult in transaction handler --> ', updateReceiverWalletBalanceResult);

                        if(updateReceiverWalletBalanceResult !== 1){
                            console.log('Error from updating Receiver wallet balance');

                            pool.rollback(() => {
                                // throw err;
    
                                return res.send({
                                    success: false,
                                    statusCode: 400,
                                    message: 'Error from updating Receiver wallet balance'
                                });
                            });

                            // res.send({
                            //     success: false,
                            //     statusCode: 400,
                            //     message: 'Error from updating Receiver wallet balance'
                            // }) 
                            
                            // return;
                        }
                    } catch (error) {
                        console.log('Entered an error --> ', error);
                        res.send({
                            success: false,
                            statusCode: 500,
                            message: 'Error retrieving update wallet balance status for receiver'
                        }) 
                        
                        return;
                    }

                    // EVERYTHING SUCCESSFUL, now commit to DB

                    pool.commit((err) => {
                        if (err) { 
                            console.log('Entered an error --> ', err);

                            pool.rollback(() => {
                                // throw err;
                                
                                res.send({
                                    success: false,
                                    statusCode: 500,
                                    message: 'Error while committing to DB'
                                }) 
                            });
                        }

                    });
            
                    // pool.query closes connection by itself  
                });

            })

            
        } else {

            return res.send({
                message: 'Receiver wallet does not exist',
                statusCode: 404,
            });
        }
        
    });

}

export default createTransfer;