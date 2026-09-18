import express from 'express';
import { bookController } from '../controllers/bookController';
import { chapterController } from '../controllers/chapterController';
import { authenticate, optionalAuthenticate } from '@bribooks/shared';

const router = express.Router();

// Public routes
router.get('/books', bookController.getPublishedBooks.bind(bookController));
router.get('/books/my', authenticate, bookController.getMyBooks.bind(bookController));
router.get('/books/:id', optionalAuthenticate, bookController.getBook.bind(bookController));
router.get('/books/:bookId/chapters', optionalAuthenticate, chapterController.getBookChapters.bind(chapterController));
router.get('/chapters/:id', optionalAuthenticate, chapterController.getChapter.bind(chapterController));

// Protected routes
router.use(authenticate);

// Book routes
router.post('/books', bookController.createBook.bind(bookController));
router.put('/books/:id', bookController.updateBook.bind(bookController));
router.delete('/books/:id', bookController.deleteBook.bind(bookController));
router.post('/books/:id/publish', bookController.publishBook.bind(bookController));

// Chapter routes
router.post('/books/:bookId/chapters', chapterController.createChapter.bind(chapterController));
router.put('/chapters/:id', chapterController.updateChapter.bind(chapterController));
router.delete('/chapters/:id', chapterController.deleteChapter.bind(chapterController));
router.post('/books/:bookId/chapters/reorder', chapterController.reorderChapters.bind(chapterController));

export default router;
