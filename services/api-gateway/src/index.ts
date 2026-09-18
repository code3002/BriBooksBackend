import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { createServiceLogger } from '@bribooks/shared';

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '../../../.env') });

const app: Application = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;
const logger = createServiceLogger('api-gateway');

// Middleware
app.use(helmet());
app.use(cors());
// app.use(express.json()); // Removed to prevent body consumption before proxy

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        service: 'api-gateway',
        timestamp: new Date().toISOString(),
    });
});

// Service URLs
const USER_SERVICE_URL = `http://localhost:${process.env.USER_SERVICE_PORT || 3001}`;
const BOOK_SERVICE_URL = `http://localhost:${process.env.BOOK_AUTHORING_SERVICE_PORT || 3002}`;
const AI_SERVICE_URL = `http://localhost:${process.env.AI_ORCHESTRATOR_SERVICE_PORT || 3003}`;
const SAFETY_SERVICE_URL = `http://localhost:${process.env.SAFETY_SERVICE_PORT || 3004}`;
const PUBLISHING_SERVICE_URL = `http://localhost:${process.env.PUBLISHING_SERVICE_PORT || 3005}`;
const NOTIFICATION_SERVICE_URL = `http://localhost:${process.env.NOTIFICATION_SERVICE_PORT || 3007}`;
const ADMIN_SERVICE_URL = `http://localhost:${process.env.ADMIN_SERVICE_PORT || 3008}`;
const PAYMENT_SERVICE_URL = `http://localhost:${process.env.PAYMENT_SERVICE_PORT || 3006}`;

// Proxy routes to microservices
app.use(
    '/api/auth',
    createProxyMiddleware({
        target: USER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth': '/api/auth',
        },
        onError: (err, _req, res) => {
            logger.error('User Service proxy error:', err);
            res.status(503).json({
                success: false,
                error: {
                    code: 'SERVICE_UNAVAILABLE',
                    message: 'User service is currently unavailable',
                },
            });
        },
    })
);

app.use(
    '/api/users',
    createProxyMiddleware({
        target: USER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/users': '/api/users',
        },
    })
);

app.use(
    '/api/books',
    createProxyMiddleware({
        target: BOOK_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/books': '/api/books',
        },
    })
);

app.use(
    '/api/chapters',
    createProxyMiddleware({
        target: BOOK_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/chapters': '/api/chapters',
        },
    })
);

app.use(
    '/api/ai',
    createProxyMiddleware({
        target: AI_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/ai': '/api/ai',
        },
    })
);

app.use(
    '/api/safety',
    createProxyMiddleware({
        target: SAFETY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/safety': '/api/safety',
        },
    })
);

app.use(
    '/api/publishing',
    createProxyMiddleware({
        target: PUBLISHING_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/publishing': '/api/publishing',
        },
    })
);

app.use(
    '/api/notifications',
    createProxyMiddleware({
        target: NOTIFICATION_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/notifications': '/api/notifications',
        },
    })
);

app.use(
    '/api/admin',
    createProxyMiddleware({
        target: ADMIN_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/admin': '/api/admin',
        },
    })
);

app.use(
    '/api/payments',
    createProxyMiddleware({
        target: PAYMENT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/payments': '/api/payments',
        },
    })
);

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found',
        },
    });
});

// Start server
app.listen(PORT, () => {
    logger.info(`🚪 API Gateway running on port ${PORT}`);
    logger.info(`📡 Proxying to services:`);
    logger.info(`   - User Service: ${USER_SERVICE_URL}`);
    logger.info(`   - Book Service: ${BOOK_SERVICE_URL}`);
    logger.info(`   - AI Service: ${AI_SERVICE_URL}`);
    logger.info(`   - Safety Service: ${SAFETY_SERVICE_URL}`);
    logger.info(`   - Publishing Service: ${PUBLISHING_SERVICE_URL}`);
    logger.info(`   - Payment Service: ${PAYMENT_SERVICE_URL}`);
    logger.info(`   - Notification Service: ${NOTIFICATION_SERVICE_URL}`);
    logger.info(`   - Admin Service: ${ADMIN_SERVICE_URL}`);
});

export default app;
