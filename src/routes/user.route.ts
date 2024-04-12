import { Router } from 'express';
import { deleteUser, getProfilePosts, getUsers, savePost, updateUser } from '../controllers/user.controller';
import { verifyToken } from '../middleware/verifyToken';

const router: Router = Router();

router.get('/', getUsers);
// router.get('/:id', verifyToken, getUser);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.post('/save', verifyToken, savePost);
router.get('/profilePosts', verifyToken, getProfilePosts);

export default router;
