import pool from "../config/dbConnection";

const findUserIdFromEmail: any = async (email: any) => {
    

    const sqlQuery = 'SELECT * FROM users WHERE email=?';

    const fromPromise = new Promise((resolve, reject) => {
        pool.query(sqlQuery, [email], (err: any, rows: any) => {
            if(err){
                console.log('Encountered an error: ', err);
                // conn.release();
        
                return reject(err);
            }
            const [RowDataPacket] = rows;
            return resolve(RowDataPacket);

            /* if(rows.length < 1){   
    
                return 'User with email not found';
            }
    
            userId = rows[0].user_id;
            console.log("userId from transactionRoute --> " + userId);
            console.log("rows from transactionRoute --> " + rows);
            
            // conn.release();
            return rows; */
        });
    });



    const currentUserId2 = await fromPromise as any;
    console.log("currentUserId from userUtils  --> " + currentUserId2.user_id);
    
    return currentUserId2.user_id;


    
}

export default findUserIdFromEmail;
