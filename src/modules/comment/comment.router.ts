import { Router } from 'express';
import { commentController } from './comment.controller';
import verifyRole, { UserRole } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/:id', commentController.getCommentsById);

router.get('/author/:authorId', commentController.getCommentsByAuthorId);

router.post('/', verifyRole(UserRole.ADMIN, UserRole.USER), commentController.createComment);

router.patch('/:id', verifyRole(UserRole.ADMIN, UserRole.USER), commentController.updateComment);

router.patch('/moderate/:id', verifyRole(UserRole.ADMIN), commentController.updateCommentByAdmin);

router.delete('/:id', verifyRole(UserRole.ADMIN, UserRole.USER), commentController.deleteComment);

export const commentRouter = router;