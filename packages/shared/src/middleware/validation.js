"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonSchemas = exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
// Generic validation middleware
const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                next(new errors_1.ValidationError('Validation failed', formattedErrors));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
// Common validation schemas
exports.commonSchemas = {
    // Pagination
    pagination: zod_1.z.object({
        query: zod_1.z.object({
            page: zod_1.z.string().optional().transform(val => parseInt(val || '1')),
            limit: zod_1.z.string().optional().transform(val => parseInt(val || '10'))
        })
    }),
    // ID parameter
    idParam: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid ID format')
        })
    }),
    // Email
    email: zod_1.z.string().email('Invalid email address'),
    // Password (min 8 chars, at least one uppercase, one lowercase, one number)
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    // Username
    username: zod_1.z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must not exceed 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
};
//# sourceMappingURL=validation.js.map