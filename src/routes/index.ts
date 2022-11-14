import { Router } from 'express';
import userRouter from './userRoute';
import walletRouter from './walletRoute';

const router = Router();

router.use('/users', userRouter);
router.use('/wallet', walletRouter);

export default router;