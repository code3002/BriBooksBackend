import { Request, Response, NextFunction } from 'express';
import { geminiService } from '../services/geminiService';
import { z } from 'zod';
import { AgeGroup } from '@bribooks/shared';

// Validation schemas
const storyGenerationSchema = z.object({
    body: z.object({
        prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
        ageGroup: z.nativeEnum(AgeGroup),
        maxLength: z.number().optional(),
    }),
});

const grammarCheckSchema = z.object({
    body: z.object({
        text: z.string().min(1, 'Text is required'),
    }),
});

const contentSuggestionsSchema = z.object({
    body: z.object({
        text: z.string().min(1, 'Text is required'),
        ageGroup: z.nativeEnum(AgeGroup),
    }),
});

const illustrationSchema = z.object({
    body: z.object({
        chapterContent: z.string().min(1, 'Chapter content is required'),
        ageGroup: z.nativeEnum(AgeGroup),
    }),
});

const contentSafetySchema = z.object({
    body: z.object({
        text: z.string().min(1, 'Text is required'),
        ageGroup: z.nativeEnum(AgeGroup),
    }),
});

const transcriptionSchema = z.object({
    body: z.object({
        audioBase64: z.string().min(1).max(8_100_000),
        mimeType: z.enum(['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav', 'audio/mpeg']),
    }),
});

export class AIController {
    async transcribeAudio(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = transcriptionSchema.parse({ body: req.body });
            const result = await geminiService.transcribeAudio(
                validated.body.audioBase64,
                validated.body.mimeType,
                req.user?.userId
            );
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    // POST /ai/generate-story
    async generateStory(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = storyGenerationSchema.parse({ body: req.body });
            const userId = req.user?.userId;

            const result = await geminiService.generateStory(
                validated.body.prompt,
                validated.body.ageGroup,
                userId,
                validated.body.maxLength
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /ai/check-grammar
    async checkGrammar(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = grammarCheckSchema.parse({ body: req.body });
            const userId = req.user?.userId;

            const result = await geminiService.checkGrammar(validated.body.text, userId);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /ai/content-suggestions
    async getContentSuggestions(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = contentSuggestionsSchema.parse({ body: req.body });
            const userId = req.user?.userId;

            const result = await geminiService.getContentSuggestions(
                validated.body.text,
                validated.body.ageGroup,
                userId
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /ai/generate-illustrations
    async generateIllustrations(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = illustrationSchema.parse({ body: req.body });
            const userId = req.user?.userId;

            const result = await geminiService.generateIllustrationDescriptions(
                validated.body.chapterContent,
                validated.body.ageGroup,
                userId
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /ai/check-safety
    async checkContentSafety(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = contentSafetySchema.parse({ body: req.body });
            const userId = req.user?.userId;

            const result = await geminiService.checkContentSafety(
                validated.body.text,
                validated.body.ageGroup,
                userId
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

export const aiController = new AIController();
