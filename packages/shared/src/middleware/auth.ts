import { Request, Response, NextFunction } from 'express';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { PrismaClient } from '@prisma/client';
import { AuthTokenPayload, UserRole } from '../types';
import { AuthenticationError, AuthorizationError } from '../utils/errors';

const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload;
        }
    }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        const secretKey = process.env.CLERK_SECRET_KEY;
        if (!secretKey) {
            throw new Error('CLERK_SECRET_KEY not configured');
        }
        const token = header.slice(7);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const authorizedParties = process.env.NODE_ENV === 'production'
            ? [frontendUrl]
            : [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
        let claims;
        try {
            claims = await verifyToken(token, {
                secretKey,
                authorizedParties,
            });
        } catch {
            throw new AuthenticationError('Invalid Clerk token');
        }
        if (!claims.sub) {
            throw new AuthenticationError('Invalid Clerk token');
        }

        let user = await prisma.user.findUnique({ where: { clerkId: claims.sub } });
        if (!user) {
            const clerkUser = await createClerkClient({ secretKey }).users.getUser(claims.sub);
            const emailAddress = clerkUser.primaryEmailAddress;
            if (!emailAddress || emailAddress.verification?.status !== 'verified') {
                throw new AuthenticationError('A verified email address is required');
            }
            const email = emailAddress.emailAddress;
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing?.clerkId && existing.clerkId !== claims.sub) {
                throw new AuthenticationError('Email is linked to another account');
            }
            user = existing
                ? await prisma.user.update({ where: { id: existing.id }, data: { clerkId: claims.sub, emailVerified: true } })
                : await prisma.user.upsert({
                    where: { clerkId: claims.sub },
                    update: {},
                    create: {
                        clerkId: claims.sub,
                        email,
                        username: `clerk_${claims.sub}`,
                        firstName: clerkUser.firstName || email.split('@')[0],
                        lastName: clerkUser.lastName || '',
                        avatarUrl: clerkUser.imageUrl,
                        emailVerified: true,
                    },
                });
        }
        req.user = { userId: user.id, email: user.email, role: user.role as UserRole };
        next();
    } catch (error) {
        next(error);
    }
};

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        next();
        return;
    }
    void authenticate(req, res, next);
};

export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AuthenticationError('User not authenticated'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`));
        }
        next();
    };
};
