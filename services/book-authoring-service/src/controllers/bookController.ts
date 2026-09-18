import { Request, Response, NextFunction } from 'express';
import { bookService } from '../services/bookService';
import { z } from 'zod';
import { AgeGroup } from '@bribooks/shared';

const createBookSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(200),
        description: z.string().max(1000).default(''),
        ageGroup: z.nativeEnum(AgeGroup),
        tags: z.array(z.string()).optional(),
        themeId: z.string().max(80).optional(),
    }),
});

const updateBookSchema = z.object({
    body: z.object({
        title: z.string().min(1).max(200).optional(),
        description: z.string().max(1000).optional(),
        ageGroup: z.nativeEnum(AgeGroup).optional(),
        tags: z.array(z.string()).optional(),
        coverImageUrl: z.string().url().optional(),
        themeId: z.string().max(80).optional(),
    }),
});

export class BookController {
    async getMyBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await bookService.getMyBooks(req.user!.userId);
            res.json({ success: true, data: books });
        } catch (error) {
            next(error);
        }
    }
    // POST /books
    async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const validated = createBookSchema.parse({ body: req.body });
            const book = await bookService.createBook(req.user.userId, validated.body);

            res.status(201).json({
                success: true,
                data: book,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /books/:id
    async getBook(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await bookService.getBookById(req.params.id, req.user?.userId);

            res.json({
                success: true,
                data: book,
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /books/:id
    async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const validated = updateBookSchema.parse({ body: req.body });
            const book = await bookService.updateBook(
                req.params.id,
                req.user.userId,
                validated.body
            );

            res.json({
                success: true,
                data: book,
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /books/:id
    async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const result = await bookService.deleteBook(req.params.id, req.user.userId);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /books/:id/publish
    async publishBook(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const book = await bookService.publishBook(req.params.id, req.user.userId);

            res.json({
                success: true,
                data: book,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /books (public)
    async getPublishedBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const filters = {
                ageGroup: req.query.ageGroup as AgeGroup | undefined,
                tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
                search: req.query.search as string | undefined,
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            };

            const result = await bookService.getPublishedBooks(filters);

            res.json({
                success: true,
                data: result.items,
                meta: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export const bookController = new BookController();
