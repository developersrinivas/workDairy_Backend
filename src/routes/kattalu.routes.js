// src/routes/kattalu.routes.js
import express from 'express';
import { createKattalu, listKattalu } from '../controllers/kattalu.controller.js';
const router = express.Router();

router.post('/create', createKattalu);
router.get('/list', listKattalu);

export default router;
