import pool from "../config/dbConnection";

const findUserIdFromEmail: any = async function findUserId(email: string) {
    let userId: string;

    await pool.getConnection((err: any, conn: any) => {
        if(err){
            console.log('Entered an error: ', err);
            
            return err;
        }

        const sqlQuery = 'SELECT * FROM users WHERE email=?';
        pool.query(sqlQuery, [email], (err: any, rows: any) => {
            if(err){
                console.log('Encountered an error: ', err);
                conn.release();
        
                return err;
            }

            if(rows.length < 1){   

                return 'User with email not found';
            }

            userId = rows[0].user_id;
            return userId;
        });

        return 'Test from findUserIdFromEmail';
    });
    
}

export default findUserIdFromEmail;