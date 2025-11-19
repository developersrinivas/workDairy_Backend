// src/routes/history.routes.js
import express from 'express';
import { history } from '../controllers/history.controller.js';
const router = express.Router();

router.get('/', history);

export default router;
