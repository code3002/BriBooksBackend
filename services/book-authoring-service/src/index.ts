import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler, createServiceLogger } from '@bribooks/shared';
import routes from './routes';

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '../../../.env') });

const app: Application = express();
const PORT = process.env.BOOK_AUTHORING_SERVICE_PORT || 3002;
const logger = createServiceLogger('book-authoring-service');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'book-authoring-service' });
});

// Routes
app.use('/api', routes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`📚 Book Authoring Service running on port ${PORT}`);
});

export default app;
