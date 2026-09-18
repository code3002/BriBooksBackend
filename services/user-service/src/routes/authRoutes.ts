import express from 'express';
import { getCurrentUser } from '../controllers/authController';
import { authenticate } from '@bribooks/shared';

const router = express.Router();

router.use(authenticate);
router.get('/me', getCurrentUser);

export default router;
