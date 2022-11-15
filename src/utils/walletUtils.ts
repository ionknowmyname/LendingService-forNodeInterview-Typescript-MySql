import pool from "../config/dbConnection";

const getWalletByWalletId: any = async (walletId: any) => {
    



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
    console.log("currentUserWallet from walletUtils  --> " + userWallet.wallet_id);
    console.log("currentUserWallet from walletUtils  --> " + userWallet.user_id);
    console.log("currentUserWallet from walletUtils  --> " + userWallet.balance);
    
    return userWallet;   
    
}

export default getWalletByWalletId;