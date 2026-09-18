import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler, createServiceLogger } from '@bribooks/shared';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '../../../.env') });

const app: Application = express();
const PORT = process.env.USER_SERVICE_PORT || 3001;
const logger = createServiceLogger('user-service');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'user-service' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 User Service running on port ${PORT}`);
    logger.info(`Database URL present: ${!!process.env.DATABASE_URL}`);
});

export default app;
