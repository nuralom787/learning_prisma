import { Router } from 'express';
import { postController } from './post.controller';
import verifyRole, { UserRole } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', postController.getAllPosts);

router.get('/:id', postController.getSinglePost);

router.post('/', verifyRole(UserRole.USER), postController.createPost);

export const PostRouter = router;