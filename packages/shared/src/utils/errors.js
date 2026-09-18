"use strict";
// Custom Error Classes
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.ExternalServiceError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    message;
    code;
    isOperational;
    constructor(statusCode, message, code = 'INTERNAL_ERROR', isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.code = code;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message, details) {
        super(400, message, 'VALIDATION_ERROR');
        this.details = details;
    }
    details;
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(401, message, 'AUTHENTICATION_ERROR');
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(message = 'Insufficient permissions') {
        super(403, message, 'AUTHORIZATION_ERROR');
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(404, `${resource} not found`, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message) {
        super(409, message, 'CONFLICT');
    }
}
exports.ConflictError = ConflictError;
class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(429, message, 'RATE_LIMIT_EXCEEDED');
    }
}
exports.RateLimitError = RateLimitError;
class ExternalServiceError extends AppError {
    constructor(service, message) {
        super(502, message || `External service ${service} is unavailable`, 'EXTERNAL_SERVICE_ERROR');
    }
}
exports.ExternalServiceError = ExternalServiceError;
// Error handler utility
const handleError = (error) => {
    if (error instanceof AppError) {
        return {
            statusCode: error.statusCode,
            code: error.code,
            message: error.message,
            ...(error instanceof ValidationError && { details: error.details })
        };
    }
    // Unknown error
    return {
        statusCode: 500,
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : error.message
    };
};
exports.handleError = handleError;
//# sourceMappingURL=errors.js.map