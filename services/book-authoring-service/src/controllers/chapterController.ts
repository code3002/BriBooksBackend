import { Request, Response, NextFunction } from 'express';
import { chapterService } from '../services/chapterService';
import { z } from 'zod';

const createChapterSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(200),
        content: z.string().default(''),
        order: z.number().int().min(1),
        illustrationUrls: z.array(z.string().url()).optional(),
    }),
});

const updateChapterSchema = z.object({
    body: z.object({
        title: z.string().min(1).max(200).optional(),
        content: z.string().optional(),
        order: z.number().int().min(1).optional(),
        illustrationUrls: z.array(z.string().url()).optional(),
    }),
});

const reorderChaptersSchema = z.object({
    body: z.object({
        chapters: z.array(
            z.object({
                chapterId: z.string().uuid(),
                order: z.number().int().min(1),
            })
        ),
    }),
});

export class ChapterController {
    // POST /books/:bookId/chapters
    async createChapter(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const validated = createChapterSchema.parse({ body: req.body });
            const chapter = await chapterService.createChapter(
                req.params.bookId,
                req.user.userId,
                validated.body
            );

            res.status(201).json({
                success: true,
                data: chapter,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /chapters/:id
    async getChapter(req: Request, res: Response, next: NextFunction) {
        try {
            const chapter = await chapterService.getChapterById(req.params.id, req.user?.userId);

            res.json({
                success: true,
                data: chapter,
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /chapters/:id
    async updateChapter(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const validated = updateChapterSchema.parse({ body: req.body });
            const chapter = await chapterService.updateChapter(
                req.params.id,
                req.user.userId,
                validated.body
            );

            res.json({
                success: true,
                data: chapter,
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /chapters/:id
    async deleteChapter(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const result = await chapterService.deleteChapter(req.params.id, req.user.userId);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /books/:bookId/chapters
    async getBookChapters(req: Request, res: Response, next: NextFunction) {
        try {
            const chapters = await chapterService.getBookChapters(req.params.bookId, req.user?.userId);

            res.json({
                success: true,
                data: chapters,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /books/:bookId/chapters/reorder
    async reorderChapters(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const validated = reorderChaptersSchema.parse({ body: req.body });
            const result = await chapterService.reorderChapters(
                req.params.bookId,
                req.user.userId,
                validated.body.chapters
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const chapterController = new ChapterController();
