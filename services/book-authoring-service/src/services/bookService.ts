import { prisma } from '@bribooks/database';
import { NotFoundError, AuthorizationError } from '@bribooks/shared';
import { BookStatus, AgeGroup } from '@bribooks/shared';

export class BookService {
    // Create new book
    async createBook(
        authorId: string,
        data: {
            title: string;
            description: string;
            ageGroup: AgeGroup;
            tags?: string[];
            themeId?: string;
        }
    ) {
        const book = await prisma.book.create({
            data: {
                title: data.title,
                description: data.description,
                authorId,
                ageGroup: data.ageGroup,
                tags: data.tags || [],
                themeId: data.themeId,
                status: BookStatus.DRAFT,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: { chapters: true },
                },
            },
        });

        return book;
    }

    // Get book by ID
    async getBookById(bookId: string, userId?: string) {
        const book = await prisma.book.findUnique({
            where: { id: bookId },
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
                chapters: {
                    orderBy: { order: 'asc' },
                },
                _count: {
                    select: { reviews: true },
                },
            },
        });

        if (!book) {
            throw new NotFoundError('Book');
        }

        // Check if user has access to draft books
        if (book.status === BookStatus.DRAFT && book.authorId !== userId) {
            throw new AuthorizationError('You do not have access to this book');
        }

        return book;
    }

    // Update book
    async updateBook(
        bookId: string,
        userId: string,
        data: {
            title?: string;
            description?: string;
            ageGroup?: AgeGroup;
            tags?: string[];
            coverImageUrl?: string;
            themeId?: string;
        }
    ) {
        // Check ownership
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            throw new NotFoundError('Book');
        }

        if (book.authorId !== userId) {
            throw new AuthorizationError('You can only edit your own books');
        }

        const updated = await prisma.book.update({
            where: { id: bookId },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return updated;
    }

    async getMyBooks(authorId: string) {
        return prisma.book.findMany({
            where: { authorId },
            include: { _count: { select: { chapters: true, reviews: true } } },
            orderBy: { updatedAt: 'desc' },
        });
    }

    // Delete book
    async deleteBook(bookId: string, userId: string) {
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            throw new NotFoundError('Book');
        }

        if (book.authorId !== userId) {
            throw new AuthorizationError('You can only delete your own books');
        }

        await prisma.book.delete({
            where: { id: bookId },
        });

        return { message: 'Book deleted successfully' };
    }

    // Publish book
    async publishBook(bookId: string, userId: string) {
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: {
                chapters: true,
            },
        });

        if (!book) {
            throw new NotFoundError('Book');
        }

        if (book.authorId !== userId) {
            throw new AuthorizationError('You can only publish your own books');
        }

        if (book.chapters.length === 0 || book.chapters.every((chapter) => !chapter.content.trim())) {
            throw new Error('Write at least one chapter before publishing');
        }

        const updated = await prisma.book.update({
            where: { id: bookId },
            data: {
                status: BookStatus.PUBLISHED,
                publishedAt: new Date(),
            },
        });

        return updated;
    }

    // Get all published books (public)
    async getPublishedBooks(filters?: {
        ageGroup?: AgeGroup;
        tags?: string[];
        search?: string;
        page?: number;
        limit?: number;
    }) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {
            status: BookStatus.PUBLISHED,
        };

        if (filters?.ageGroup) {
            where.ageGroup = filters.ageGroup;
        }

        if (filters?.tags && filters.tags.length > 0) {
            where.tags = {
                hasSome: filters.tags,
            };
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                skip,
                take: limit,
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    _count: {
                        select: { chapters: true, reviews: true },
                    },
                },
                orderBy: { publishedAt: 'desc' },
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
}

export const bookService = new BookService();
