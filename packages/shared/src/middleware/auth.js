"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
// JWT Authentication Middleware
const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.AuthenticationError('No token provided');
        }
        const token = authHeader.substring(7);
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errors_1.AuthenticationError('Invalid token'));
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new errors_1.AuthenticationError('Token expired'));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
// Role-based Authorization Middleware
const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errors_1.AuthenticationError('User not authenticated'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new errors_1.AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`));
        }
        next();
    };
};
exports.authorize = authorize;
// Generate JWT Token
const generateToken = (payload) => {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
    }
    return jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn });
};
exports.generateToken = generateToken;
// Verify JWT Token
const verifyToken = (token) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
    }
    return jsonwebtoken_1.default.verify(token, jwtSecret);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map