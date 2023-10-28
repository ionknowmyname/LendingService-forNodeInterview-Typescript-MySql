import { Router } from 'express'
import authenticate from '../config/authentication';
import createWallet from '../handlers/walletHandler';


const walletRouter = Router();

walletRouter.post('/create', authenticate, createWallet);




export default walletRouter;