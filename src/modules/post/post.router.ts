import { Router } from 'express';
import { postController } from './post.controller';
import verifyRole, { UserRole } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', postController.getAllPosts);

router.get('/my-posts', verifyRole(UserRole.ADMIN, UserRole.USER), postController.getAllPostsByUser);

router.get('/:id', postController.getSinglePost);

router.post('/', verifyRole(UserRole.ADMIN, UserRole.USER), postController.createPost);

router.patch('/:id', verifyRole(UserRole.ADMIN, UserRole.USER), postController.updatePost);

router.delete('/:id', verifyRole(UserRole.ADMIN, UserRole.USER), postController.deletePost);

export const PostRouter = router;