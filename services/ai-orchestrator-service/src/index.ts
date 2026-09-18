import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler, createServiceLogger } from '@bribooks/shared';
import aiRoutes from './routes/aiRoutes';

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '../../../.env') });

const app: Application = express();
const PORT = process.env.AI_ORCHESTRATOR_SERVICE_PORT || 3003;
const logger = createServiceLogger('ai-orchestrator-service');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Larger limit for AI content
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'ai-orchestrator-service' });
});

// Routes
app.use('/api/ai', aiRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`🤖 AI Orchestrator Service running on port ${PORT}`);
});

export default app;
