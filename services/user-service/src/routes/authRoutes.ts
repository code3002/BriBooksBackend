import express from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '@bribooks/shared';

const router = express.Router();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/google', authController.googleAuth.bind(authController));
router.post('/apple', authController.appleAuth.bind(authController));

// Protected routes
router.use(authenticate);
router.get('/me', authController.getCurrentUser.bind(authController));
router.post('/verify-email', authController.verifyEmail.bind(authController));
router.post('/change-password', authController.changePassword.bind(authController));

export default router;
