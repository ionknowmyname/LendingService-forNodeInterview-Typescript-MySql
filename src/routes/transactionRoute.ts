import { Router } from 'express'
import authenticate from '../config/authentication';
import createTransfer from '../handlers/transactionHandler';


const transactionRouter = Router();

transactionRouter.post('/transfer', authenticate, createTransfer);

export default transactionRouter;