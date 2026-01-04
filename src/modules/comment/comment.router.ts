import { Router } from 'express';
import verifyRole, { UserRole } from '../../middlewares/authMiddleware';
import { commentController } from './comment.controller';

const router = Router();

router.post('/', verifyRole(UserRole.USER, UserRole.ADMIN), commentController.createComment);

export const commentRouter = router;