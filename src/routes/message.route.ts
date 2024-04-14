import { Router } from 'express';
import { addMessage, sendFirstMessage } from '../controllers/message.controller';
import { verifyToken } from '../middleware/verifyToken';

const router: Router = Router();

router.post('/:chatId', verifyToken, addMessage);
router.post('/to/:receiverId', verifyToken, sendFirstMessage);
export default router;
