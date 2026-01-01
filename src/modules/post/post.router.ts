import { Router } from 'express';
import { postController } from './post.controller';
import verifyRole, { UserRole } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', postController.getAllPosts);

router.post('/', verifyRole(UserRole.User), postController.createPost);

export const PostRouter = router;