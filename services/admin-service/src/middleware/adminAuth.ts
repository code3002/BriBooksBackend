import { Request, Response, NextFunction } from 'express';

/**
 * Admin authorization middleware
 * Verifies user is authenticated and has ADMIN role
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                },
            });
        }

        // Check if user has ADMIN role
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Admin access required',
                },
            });
        }

        return next();
    } catch (error) {
        return next(error);
    }
};
