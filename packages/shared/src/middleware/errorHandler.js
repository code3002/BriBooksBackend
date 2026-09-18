"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const errorHandler = (error, req, res, _next) => {
    // Log error
    logger_1.logger.error({
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method
    });
    const errorResponse = (0, errors_1.handleError)(error);
    res.status(errorResponse.statusCode).json({
        success: false,
        error: {
            code: errorResponse.code,
            message: errorResponse.message,
            ...(errorResponse.details && { details: errorResponse.details })
        }
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map