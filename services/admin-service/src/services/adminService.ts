import { prisma } from '@bribooks/database';
import { NotFoundError } from '@bribooks/shared';

export interface UserFilters {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class AdminService {
    /**
     * Get all users with filters and pagination
     */
    async getUsers(filters: UserFilters = {}): Promise<PaginatedResult<any>> {
        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 20, 100);
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters.role) {
            where.role = filters.role;
        }

        if (filters.search) {
            where.OR = [
                { email: { contains: filters.search, mode: 'insensitive' } },
                { username: { contains: filters.search, mode: 'insensitive' } },
                { firstName: { contains: filters.search, mode: 'insensitive' } },
                { lastName: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    emailVerified: true,
                    createdAt: true,
                    _count: {
                        select: {
                            books: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where }),
        ]);

        return {
            items: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Update user role
     */
    async updateUserRole(userId: string, role: 'ADMIN' | 'AUTHOR' | 'READER' | 'MODERATOR'): Promise<any> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        return await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
            },
        });
    }

    /**
     * Suspend user account
     */
    async suspendUser(userId: string): Promise<any> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Note: isActive field doesn't exist in current schema
        // This is a placeholder for future implementation
        return user;
    }

    /**
     * Activate user account
     */
    async activateUser(userId: string): Promise<any> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Note: isActive field doesn't exist in current schema
        // This is a placeholder for future implementation
        return user;
    }

    /**
     * Get books pending review
     */
    async getPendingBooks(page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
        const skip = (page - 1) * limit;

        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where: { status: 'UNDER_REVIEW' },
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: { chapters: true },
                    },
                },
            }),
            prisma.book.count({ where: { status: 'UNDER_REVIEW' } }),
        ]);

        return {
            items: books,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Approve book
     */
    async approveBook(bookId: string): Promise<any> {
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        return await prisma.book.update({
            where: { id: bookId },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date(),
            },
        });
    }

    /**
     * Reject book
     */
    async rejectBook(bookId: string, _reason?: string): Promise<any> {
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        return await prisma.book.update({
            where: { id: bookId },
            data: { status: 'DRAFT' },
        });
    }

    /**
     * Get user analytics
     */
    async getUserAnalytics(): Promise<any> {
        const [totalUsers, usersByRole] = await Promise.all([
            prisma.user.count(),
            prisma.user.groupBy({
                by: ['role'],
                _count: true,
            }),
        ]);

        return {
            totalUsers,
            activeUsers: totalUsers, // Placeholder
            inactiveUsers: 0, // Placeholder
            usersByRole: usersByRole.map((r) => ({
                role: r.role,
                count: r._count,
            })),
        };
    }

    /**
     * Get book analytics
     */
    async getBookAnalytics(): Promise<any> {
        const [totalBooks, publishedBooks, booksByStatus, booksByAgeGroup] = await Promise.all([
            prisma.book.count(),
            prisma.book.count({ where: { status: 'PUBLISHED' } }),
            prisma.book.groupBy({
                by: ['status'],
                _count: true,
            }),
            prisma.book.groupBy({
                by: ['ageGroup'],
                _count: true,
            }),
        ]);

        return {
            totalBooks,
            publishedBooks,
            booksByStatus: booksByStatus.map((b) => ({
                status: b.status,
                count: b._count,
            })),
            booksByAgeGroup: booksByAgeGroup.map((b) => ({
                ageGroup: b.ageGroup,
                count: b._count,
            })),
        };
    }

    /**
     * Get system overview
     */
    async getSystemOverview(): Promise<any> {
        const [userStats, bookStats, chapterCount, reviewCount] = await Promise.all([
            this.getUserAnalytics(),
            this.getBookAnalytics(),
            prisma.chapter.count(),
            prisma.review.count(),
        ]);

        return {
            users: userStats,
            books: bookStats,
            totalChapters: chapterCount,
            totalReviews: reviewCount,
        };
    }

    /**
     * Get database statistics
     */
    async getDatabaseStats(): Promise<any> {
        const [userCount, bookCount, chapterCount, reviewCount, notificationCount] =
            await Promise.all([
                prisma.user.count(),
                prisma.book.count(),
                prisma.chapter.count(),
                prisma.review.count(),
                prisma.notification.count(),
            ]);

        return {
            tables: {
                users: userCount,
                books: bookCount,
                chapters: chapterCount,
                reviews: reviewCount,
                notifications: notificationCount,
            },
        };
    }
}

export const adminService = new AdminService();
