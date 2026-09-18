import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler, createServiceLogger } from '@bribooks/shared';
import paymentRoutes from './routes/paymentRoutes';

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '../../../.env') });

const app: Application = express();
const PORT = process.env.PAYMENT_SERVICE_PORT || 3006;
const logger = createServiceLogger('payment-service');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'payment-service' });
});

// Routes
app.use('/api/payments', paymentRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`💳 Payment Service running on port ${PORT}`);
});

export default app;
