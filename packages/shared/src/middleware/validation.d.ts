import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
export declare const validate: (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const commonSchemas: {
    pagination: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
            limit: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            limit: number;
        }, {
            page?: string | undefined;
            limit?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        query: {
            page: number;
            limit: number;
        };
    }, {
        query: {
            page?: string | undefined;
            limit?: string | undefined;
        };
    }>;
    idParam: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            id: string;
        };
    }, {
        params: {
            id: string;
        };
    }>;
    email: z.ZodString;
    password: z.ZodString;
    username: z.ZodString;
};
//# sourceMappingURL=validation.d.ts.map