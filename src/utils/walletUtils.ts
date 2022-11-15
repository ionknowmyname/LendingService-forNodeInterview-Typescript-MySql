import pool from "../config/dbConnection";

const checkWalletExists: any = async (walletId: string) => {
    

    await pool.connect((err: any, conn: any) => {
        if(err){
            console.log('Entered an error: ', err);
            
            return err;
        }

        const sqlQuery = 'SELECT * FROM wallets WHERE wallet_id=?';
        pool.query(sqlQuery, [walletId], (err: any, rows: any) => {
            if(err){
                console.log('Encountered an error: ', err);
                conn.release();
        
                return err;
            }

            if(rows.length >= 1){   
                return true;
            } else {
                return false;
            }
        });

        return false;
    });
    
}

export default checkWalletExists;