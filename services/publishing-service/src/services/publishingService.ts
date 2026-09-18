import { prisma } from '@bribooks/database';
import { AgeGroup, NotFoundError } from '@bribooks/shared';

export interface BookFilters {
    ageGroup?: AgeGroup;
    tags?: string[];
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

export class PublishingService {
    /**
     * Get all published books with filters and pagination
     */
    async getPublishedBooks(filters: BookFilters = {}): Promise<PaginatedResult<any>> {
        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 10, 50); // Max 50 per page
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            status: 'PUBLISHED',
        };

        if (filters.ageGroup) {
            where.ageGroup = filters.ageGroup;
        }

        if (filters.tags && filters.tags.length > 0) {
            where.tags = {
                hasSome: filters.tags,
            };
        }

        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        // Get books and total count
        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { publishedAt: 'desc' },
                    { createdAt: 'desc' },
                ],
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                        },
                    },
                    _count: {
                        select: {
                            chapters: true,
                            reviews: true,
                        },
                    },
                },
            }),
            prisma.book.count({ where }),
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
     * Search books by query
     */
    async searchBooks(query: string, filters: BookFilters = {}): Promise<PaginatedResult<any>> {
        return this.getPublishedBooks({
            ...filters,
            search: query,
        });
    }

    /**
     * Get book by ID with view tracking
     */
    async getBookById(id: string, incrementView: boolean = true): Promise<any> {
        const book = await prisma.book.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                        bio: true,
                    },
                },
                chapters: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        order: true,
                        illustrationUrls: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                reviews: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: {
                        chapters: true,
                        reviews: true,
                    },
                },
            },
        });

        if (!book) {
            throw new NotFoundError('Book not found');
        }

        // Only show published books
        if (book.status !== 'PUBLISHED') {
            throw new NotFoundError('Book not found');
        }

        // Increment view count
        if (incrementView) {
            await this.incrementViewCount(id);
        }

        return book;
    }

    /**
     * Get popular books by view count
     */
    async getPopularBooks(limit: number = 10): Promise<any[]> {
        const books = await prisma.book.findMany({
            where: {
                status: 'PUBLISHED',
            },
            take: Math.min(limit, 50),
            orderBy: [
                { viewCount: 'desc' },
                { publishedAt: 'desc' },
            ],
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: {
                        chapters: true,
                        reviews: true,
                    },
                },
            },
        });

        return books;
    }

    /**
     * Get books by age group
     */
    async getBooksByAgeGroup(ageGroup: AgeGroup, limit: number = 10): Promise<any[]> {
        const books = await prisma.book.findMany({
            where: {
                status: 'PUBLISHED',
                ageGroup,
            },
            take: Math.min(limit, 50),
            orderBy: [
                { publishedAt: 'desc' },
                { viewCount: 'desc' },
            ],
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: {
                        chapters: true,
                        reviews: true,
                    },
                },
            },
        });

        return books;
    }

    /**
     * Increment view count for a book
     */
    async incrementViewCount(bookId: string): Promise<void> {
        await prisma.book.update({
            where: { id: bookId },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });
    }

    /**
     * Get recently published books
     */
    async getRecentBooks(limit: number = 10): Promise<any[]> {
        const books = await prisma.book.findMany({
            where: {
                status: 'PUBLISHED',
            },
            take: Math.min(limit, 50),
            orderBy: {
                publishedAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: {
                        chapters: true,
                        reviews: true,
                    },
                },
            },
        });

        return books;
    }
}

export const publishingService = new PublishingService();
