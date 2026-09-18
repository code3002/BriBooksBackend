import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { prisma } from '@bribooks/database';
import { generateToken, AuthTokenPayload } from '@bribooks/shared';
import {
    AuthenticationError,
    ConflictError,
    NotFoundError,
} from '@bribooks/shared';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const APPLE_ISSUER = 'https://appleid.apple.com';

const appleJwksClient = jwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys',
    cache: true,
    rateLimit: true,
});

const getAppleSigningKey: jwt.GetPublicKeyOrSecret = (header, callback) => {
    appleJwksClient.getSigningKey(header.kid, (err, key) => {
        if (err || !key) {
            callback(err || new Error('Apple signing key not found'));
            return;
        }
        callback(null, key.getPublicKey());
    });
};

// Verify an Apple ID token against Apple's public keys (RS256) and validate
// the issuer/audience claims before trusting any of its contents.
function verifyAppleToken(idToken: string): Promise<jwt.JwtPayload> {
    return new Promise((resolve, reject) => {
        jwt.verify(
            idToken,
            getAppleSigningKey,
            {
                issuer: APPLE_ISSUER,
                audience: process.env.APPLE_CLIENT_ID,
                algorithms: ['RS256'],
            },
            (err, decoded) => {
                if (err || !decoded || typeof decoded === 'string') {
                    reject(new AuthenticationError('Invalid Apple token'));
                    return;
                }
                resolve(decoded);
            }
        );
    });
}

export class AuthService {
    // Register new user
    async register(data: {
        email: string;
        username: string;
        password: string;
        firstName: string;
        lastName: string;
    }) {
        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { username: data.username }],
            },
        });

        if (existingUser) {
            if (existingUser.email === data.email) {
                throw new ConflictError('Email already registered');
            }
            throw new ConflictError('Username already taken');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });

        // Generate token
        const tokenPayload: AuthTokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role as any,
        };
        const token = generateToken(tokenPayload);

        return { user, token };
    }

    // Login user
    async login(email: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AuthenticationError('Invalid credentials');
        }

        if (!user.passwordHash) {
            throw new AuthenticationError('This account uses Google or Apple sign-in. Please use that to log in.');
        }

        // Verify password (passwordHash is guaranteed non-null after the guard above)
        const isValidPassword = await bcrypt.compare(password, user.passwordHash as string);

        if (!isValidPassword) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Generate token
        const tokenPayload: AuthTokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role as any,
        };
        const token = generateToken(tokenPayload);

        // Return user without password
        const { passwordHash, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }

    // Verify email
    async verifyEmail(userId: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { emailVerified: true },
            select: {
                id: true,
                email: true,
                emailVerified: true,
            },
        });

        return user;
    }

    // Google OAuth sign-in / sign-up
    async googleAuth(idToken: string) {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.email_verified) {
            throw new AuthenticationError('Invalid Google token');
        }

        const { sub: googleId, email, given_name: firstName = '', family_name: lastName = '', picture: avatarUrl } = payload;

        // Find existing user by googleId or email
        let user = await prisma.user.findFirst({
            where: { OR: [{ googleId }, { email }] },
        });

        if (!user) {
            // Create new OAuth user (no password)
            const username = email.split('@')[0] + '_' + Math.random().toString(36).slice(2, 6);
            user = await prisma.user.create({
                data: {
                    email,
                    username,
                    googleId,
                    firstName: firstName || email.split('@')[0],
                    lastName: lastName || '',
                    avatarUrl: avatarUrl || null,
                    emailVerified: true,
                },
            });
        } else if (!user.googleId) {
            // Link Google account to existing email user
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId, avatarUrl: user.avatarUrl || avatarUrl || null, emailVerified: true },
            });
        }

        const tokenPayload: AuthTokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role as any,
        };
        const token = generateToken(tokenPayload);
        const { passwordHash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    // Apple Sign In
    async appleAuth(idToken: string, userData?: { firstName?: string; lastName?: string }) {
        // Verify the Apple ID token's signature against Apple's public keys
        // before trusting any of its claims.
        const decoded = await verifyAppleToken(idToken);

        if (!decoded.sub || typeof decoded.email !== 'string' ||
            (decoded.email_verified !== true && decoded.email_verified !== 'true')) {
            throw new AuthenticationError('Invalid Apple token payload');
        }

        const appleId: string = decoded.sub;
        const email: string = decoded.email;
        const firstName = userData?.firstName || email.split('@')[0];
        const lastName = userData?.lastName || '';

        let user = await prisma.user.findFirst({
            where: { OR: [{ appleId }, { email }] },
        });

        if (!user) {
            const username = email.split('@')[0] + '_' + Math.random().toString(36).slice(2, 6);
            user = await prisma.user.create({
                data: {
                    email,
                    username,
                    appleId,
                    firstName,
                    lastName,
                    emailVerified: true,
                },
            });
        } else if (!user.appleId) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { appleId, emailVerified: true },
            });
        }

        const tokenPayload: AuthTokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role as any,
        };
        const token = generateToken(tokenPayload);
        const { passwordHash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    // Change password
    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundError('User');
        }

        if (!user.passwordHash) {
            throw new AuthenticationError('This account uses social sign-in and has no password.');
        }

        // Verify old password
        const isValidPassword = await bcrypt.compare(oldPassword, user.passwordHash as string);

        if (!isValidPassword) {
            throw new AuthenticationError('Current password is incorrect');
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });

        return { message: 'Password updated successfully' };
    }
}

export const authService = new AuthService();
