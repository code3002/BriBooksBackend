import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler, createServiceLogger } from '@bribooks/shared';
import notificationRoutes from './routes/notificationRoutes';

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '../../../.env') });

const app: Application = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3007;
const logger = createServiceLogger('notification-service');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'notification-service' });
});

// Routes
app.use('/api/notifications', notificationRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`🔔 Notification Service running on port ${PORT}`);
});

export default app;
