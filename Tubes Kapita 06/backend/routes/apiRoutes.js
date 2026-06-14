import express from 'express';
import { analyzePolicy } from '../controllers/analyzeController.js';
import { getHistory, deleteHistoryItem, clearHistory } from '../controllers/historyController.js';

const router = express.Router();

// Analyze Route
router.post('/analyze', analyzePolicy);

// History Routes
router.get('/history', getHistory);
router.delete('/history/:id', deleteHistoryItem);
router.delete('/history', clearHistory);

export default router;
