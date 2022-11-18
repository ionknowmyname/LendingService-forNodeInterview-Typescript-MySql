import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

/* const pool = mysql.createPool({  //  createConnection
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
    multipleStatements: true
}); */

const pool = mysql.createPool({  //  createConnection
    host: "db4free.net",
    user: "lendingservice",
    password: "lendingservice",
    database: "lendingservice",
    connectionLimit: 10,
    multipleStatements: true
});

export default pool;