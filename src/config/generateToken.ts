// import { Jwt } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken: any = function generate(user: any) {
    const tokenSecret: string = 'my-token-secret';
    return jwt.sign({ data: user }, tokenSecret, { expiresIn: '03h' });  // process.env.EXPIRESIN
}

export default generateToken;