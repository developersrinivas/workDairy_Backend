// src/routes/trips.js
import express from 'express';
import { createTrip, listTrips } from '../controllers/trips.controller.js';
const router = express.Router();

router.post('/create', createTrip);
router.get('/list', listTrips);

export default router;
