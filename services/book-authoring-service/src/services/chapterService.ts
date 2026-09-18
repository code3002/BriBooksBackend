import { prisma } from '@bribooks/database';
import { NotFoundError, AuthorizationError } from '@bribooks/shared';

export class ChapterService {
    // Create chapter
    async createChapter(
        bookId: string,
        userId: string,
        data: {
            title: string;
            content: string;
            order: number;
            illustrationUrls?: string[];
        }
    ) {
        // Verify book ownership
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            throw new NotFoundError('Book');
        }

        if (book.authorId !== userId) {
            throw new AuthorizationError('You can only add chapters to your own books');
        }

        const chapter = await prisma.chapter.create({
            data: {
                bookId,
                title: data.title,
                content: data.content,
                order: data.order,
                illustrationUrls: data.illustrationUrls || [],
            },
        });

        return chapter;
    }

    // Get chapter by ID
    async getChapterById(chapterId: string, userId?: string) {
        const chapter = await prisma.chapter.findUnique({
            where: { id: chapterId },
            include: {
                book: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        });

        if (!chapter) {
            throw new NotFoundError('Chapter');
        }

        if (chapter.book.status !== 'PUBLISHED' && chapter.book.authorId !== userId) {
            throw new AuthorizationError('You do not have access to this chapter');
        }

        return chapter;
    }

    // Update chapter
    async updateChapter(
        chapterId: string,
        userId: string,
        data: {
            title?: string;
            content?: string;
            order?: number;
            illustrationUrls?: string[];
        }
    ) {
        const chapter = await prisma.chapter.findUnique({
            where: { id: chapterId },
            include: { book: true },
        });

        if (!chapter) {
            throw new NotFoundError('Chapter');
        }

        if (chapter.book.authorId !== userId) {
            throw new AuthorizationError('You can only edit chapters in your own books');
        }

        const updated = await prisma.chapter.update({
            where: { id: chapterId },
            data,
        });

        return updated;
    }

    // Delete chapter
    async deleteChapter(chapterId: string, userId: string) {
        const chapter = await prisma.chapter.findUnique({
            where: { id: chapterId },
            include: { book: true },
        });

        if (!chapter) {
            throw new NotFoundError('Chapter');
        }

        if (chapter.book.authorId !== userId) {
            throw new AuthorizationError('You can only delete chapters in your own books');
        }

        await prisma.chapter.delete({
            where: { id: chapterId },
        });

        return { message: 'Chapter deleted successfully' };
    }

    // Get all chapters for a book
    async getBookChapters(bookId: string, userId?: string) {
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new NotFoundError('Book');
        }
        if (book.status !== 'PUBLISHED' && book.authorId !== userId) {
            throw new AuthorizationError('You do not have access to this book');
        }
        const chapters = await prisma.chapter.findMany({
            where: { bookId },
            orderBy: { order: 'asc' },
        });

        return chapters;
    }

    // Reorder chapters
    async reorderChapters(
        bookId: string,
        userId: string,
        chapterOrders: { chapterId: string; order: number }[]
    ) {
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            throw new NotFoundError('Book');
        }

        if (book.authorId !== userId) {
            throw new AuthorizationError('You can only reorder chapters in your own books');
        }

        // Update all chapters in a transaction
        await prisma.$transaction(
            chapterOrders.map(({ chapterId, order }) =>
                prisma.chapter.update({
                    where: { id: chapterId },
                    data: { order },
                })
            )
        );

        return { message: 'Chapters reordered successfully' };
    }
}

export const chapterService = new ChapterService();
