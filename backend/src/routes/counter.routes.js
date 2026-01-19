import {
  inc,
  dec,
  getCounter
} from '../controllers/counter.controller.js';

import express from 'express';
const router = express.Router();
import authMiddleware from '../middlewares/auth.middleware.js';

router.get('/', authMiddleware, getCounter);

router.post('/increment', authMiddleware, inc);

router.post('/decrement', authMiddleware, dec);

export default router;
