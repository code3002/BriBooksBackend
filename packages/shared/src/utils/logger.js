"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize, errors } = winston_1.default.format;
// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, service }) => {
    return `${timestamp} [${service || 'app'}] ${level}: ${stack || message}`;
});
// Create logger instance
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    defaultMeta: { service: 'bribooks' },
    transports: [
        // Console transport
        new winston_1.default.transports.Console({
            format: combine(colorize(), logFormat)
        }),
        // File transport for errors
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        // File transport for all logs
        new winston_1.default.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});
// Create service-specific logger
const createServiceLogger = (serviceName) => {
    return exports.logger.child({ service: serviceName });
};
exports.createServiceLogger = createServiceLogger;
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map