import pool from "../config/dbConnection";

let getWalletByWalletId: any = async (walletId: any) => {

    const sqlQuery = 'SELECT * FROM wallets WHERE wallet_id=?';

    const fromPromise = new Promise((resolve, reject) => {
        pool.query(sqlQuery, [walletId], (err: any, rows: any) => {
            if(err){
                console.log('Encountered an error: ', err);
                // conn.release();
        
                return reject(err);
            }

            const [RowDataPacket] = rows;
            return resolve(RowDataPacket);
        });
    });


    const userWallet = await fromPromise as any;
    console.log("currentUserWalletId from walletUtils  --> " + userWallet.wallet_id);
    console.log("currentUserWalletUserId from walletUtils  --> " + userWallet.user_id);
    console.log("currentUserWalletBalance from walletUtils  --> " + userWallet.balance);
    
    return userWallet;   
    
}

let updateWalletBalance: any = async (currentBalance: any, transactionAmount: any, walletId: any, forWho: any) => {

    const fromPromise = new Promise((resolve, reject) => {

        const sqlQuery = `UPDATE wallets SET balance=? WHERE wallet_id=?`;
        let newBalance: any;
        if(forWho === "sender"){
            newBalance = currentBalance - transactionAmount; 
        } else { 
            newBalance = currentBalance + transactionAmount;  // for receiver
        }
        
        pool.query(sqlQuery, [newBalance, walletId], (err: any, rows: any) => {
            if(err){
                console.log('Encountered an error: ', err);
                
                return reject(err);   
            }
            // console.log("affected rows from walletUtils --> " + Object.keys(rows));
            

            // nothing was updated, throw error
            if(rows.affectedRows < 1){  
                console.log('Wallet balance update failed from walletUtils');
                
                return reject('Wallet balance update failed from walletUtils');
            }

            return resolve(rows); 
        });

    });

    const rowResult = await fromPromise as any;
    console.log("affected rows number from walletUtils  --> " + rowResult.affectedRows);
    
    return rowResult.affectedRows;    
};

export { getWalletByWalletId, updateWalletBalance };