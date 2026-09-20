import express from 'express';
import { aiController } from '../controllers/aiController';
import { authenticate } from '@bribooks/shared';

const router = express.Router();

// All AI routes require authentication
router.use(authenticate);

router.post('/transcribe', aiController.transcribeAudio.bind(aiController));
router.post('/generate-story', aiController.generateStory.bind(aiController));
router.post('/check-grammar', aiController.checkGrammar.bind(aiController));
router.post('/content-suggestions', aiController.getContentSuggestions.bind(aiController));
router.post('/generate-illustrations', aiController.generateIllustrations.bind(aiController));
router.post('/check-safety', aiController.checkContentSafety.bind(aiController));

export default router;
