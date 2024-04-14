import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import { rateLimiter } from '../middleware/rateLimiting';
import { validateData } from '../middleware/validation';
import { userLoginSchema, userRegisterSchema } from '../schemas';

const router: Router = Router();

router.post('/register', rateLimiter, validateData(userRegisterSchema), register);
router.post('/login', rateLimiter, validateData(userLoginSchema), login);
router.post('/logout', logout);

export default router;
