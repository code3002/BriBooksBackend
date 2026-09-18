import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/adminService';
import { z } from 'zod';

// Validation schemas
const getUsersSchema = z.object({
    query: z.object({
        role: z.string().optional(),
        search: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

const updateRoleSchema = z.object({
    body: z.object({
        role: z.enum(['ADMIN', 'AUTHOR', 'READER', 'MODERATOR']),
    }),
});

const rejectBookSchema = z.object({
    body: z.object({
        reason: z.string().optional(),
    }),
});

export class AdminController {
    // GET /api/admin/users
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = getUsersSchema.parse({ query: req.query });

            const filters = {
                role: validated.query.role,
                search: validated.query.search,
                page: validated.query.page ? parseInt(validated.query.page) : undefined,
                limit: validated.query.limit ? parseInt(validated.query.limit) : undefined,
            };

            const result = await adminService.getUsers(filters);

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

    // PUT /api/admin/users/:id/role
    async updateUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = updateRoleSchema.parse({ body: req.body });
            const user = await adminService.updateUserRole(req.params.id, validated.body.role);

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/admin/users/:id/suspend
    async suspendUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await adminService.suspendUser(req.params.id);

            res.json({
                success: true,
                data: user,
                message: 'User suspended successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/admin/users/:id/activate
    async activateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await adminService.activateUser(req.params.id);

            res.json({
                success: true,
                data: user,
                message: 'User activated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/admin/books/pending
    async getPendingBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

            const result = await adminService.getPendingBooks(page, limit);

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

    // PUT /api/admin/books/:id/approve
    async approveBook(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await adminService.approveBook(req.params.id);

            res.json({
                success: true,
                data: book,
                message: 'Book approved and published successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/admin/books/:id/reject
    async rejectBook(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = rejectBookSchema.parse({ body: req.body });
            const book = await adminService.rejectBook(req.params.id, validated.body.reason);

            res.json({
                success: true,
                data: book,
                message: 'Book rejected successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/admin/analytics/users
    async getUserAnalytics(_req: Request, res: Response, next: NextFunction) {
        try {
            const analytics = await adminService.getUserAnalytics();

            res.json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/admin/analytics/books
    async getBookAnalytics(_req: Request, res: Response, next: NextFunction) {
        try {
            const analytics = await adminService.getBookAnalytics();

            res.json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/admin/analytics/overview
    async getSystemOverview(_req: Request, res: Response, next: NextFunction) {
        try {
            const overview = await adminService.getSystemOverview();

            res.json({
                success: true,
                data: overview,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/admin/system/database
    async getDatabaseStats(_req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await adminService.getDatabaseStats();

            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const adminController = new AdminController();
