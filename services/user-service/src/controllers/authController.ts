import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { z } from 'zod';
import { commonSchemas } from '@bribooks/shared';

// Validation schemas
const registerSchema = z.object({
    body: z.object({
        email: commonSchemas.email,
        username: commonSchemas.username,
        password: commonSchemas.password,
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: commonSchemas.email,
        password: z.string().min(1, 'Password is required'),
    }),
});

const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1, 'Current password is required'),
        newPassword: commonSchemas.password,
    }),
});

export class AuthController {
    // POST /auth/register
    async register(req: Request, res: Response, next: NextFunction) {
        console.log('AuthController.register called with body:', req.body);
        try {
            const validated = registerSchema.parse({ body: req.body });
            console.log('Validation successful');
            const result = await authService.register(validated.body);
            console.log('Service call successful');

            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error('AuthController error:', error);
            next(error);
        }
    }

    // POST /auth/login
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = loginSchema.parse({ body: req.body });
            const result = await authService.login(
                validated.body.email,
                validated.body.password
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error('AuthController error:', error);
            next(error);
        }
    }

    // POST /auth/verify-email
    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const result = await authService.verifyEmail(req.user.userId);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error('AuthController error:', error);
            next(error);
        }
    }

    // POST /auth/change-password
    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const validated = changePasswordSchema.parse({ body: req.body });
            const result = await authService.changePassword(
                req.user.userId,
                validated.body.oldPassword,
                validated.body.newPassword
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error('AuthController error:', error);
            next(error);
        }
    }

    // POST /auth/google
    async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { idToken } = req.body;
            if (!idToken) {
                res.status(400).json({ success: false, error: { message: 'idToken is required' } });
                return;
            }
            const result = await authService.googleAuth(idToken);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    // POST /auth/apple
    async appleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { idToken, user: userData } = req.body;
            if (!idToken) {
                res.status(400).json({ success: false, error: { message: 'idToken is required' } });
                return;
            }
            const result = await authService.appleAuth(idToken, userData);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    // GET /auth/me
    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            res.json({
                success: true,
                data: req.user,
            });
        } catch (error) {
            console.error('AuthController error:', error);
            next(error);
        }
    }
}

export const authController = new AuthController();
