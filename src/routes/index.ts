import { Router } from 'express';
import authRouter from './auth.route';
import postRouter from './post.route';
import userRouter from './user.route';
import chatRouter from './chat.route';
import messageRouter from './message.route';

const router: Router = Router();
router.use('/auth', authRouter);
router.use('/post', postRouter);
router.use('/user', userRouter);

export default router;
