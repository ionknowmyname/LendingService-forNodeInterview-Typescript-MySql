import { Router, Request, Response } from 'express';
import userRouter from './userRoute';
import walletRouter from './walletRoute';
import transactionRouter from './transactionRoute';

const router = Router();

router.use('/', (req: Request, res: Response) => {
    res.send("Deployed Successfully"); 
});
router.use('/users', userRouter);
router.use('/wallets', walletRouter);
router.use('/transactions', transactionRouter);

export default router;