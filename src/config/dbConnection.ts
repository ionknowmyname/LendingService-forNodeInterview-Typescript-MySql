import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createConnection({  //  createPool
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    // connectionLimit: 10,   // only for createPool
    multipleStatements: true
});


export default pool;