export declare class AppError extends Error {
    statusCode: number;
    message: string;
    code: string;
    isOperational: boolean;
    constructor(statusCode: number, message: string, code?: string, isOperational?: boolean);
}
export declare class ValidationError extends AppError {
    constructor(message: string, details?: any);
    details?: any;
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string);
}
export declare class AuthorizationError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string);
}
export declare class RateLimitError extends AppError {
    constructor(message?: string);
}
export declare class ExternalServiceError extends AppError {
    constructor(service: string, message?: string);
}
export declare const handleError: (error: Error | AppError) => {
    details?: any;
    statusCode: number;
    code: string;
    message: string;
};
//# sourceMappingURL=errors.d.ts.map