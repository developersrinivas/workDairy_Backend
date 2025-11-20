// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import personsRoutes from './routes/persons.routes.js';
import kattaluRoutes from './routes/kattalu.routes.js';
import tripsRoutes from './routes/trips.js';
import historyRoutes from './routes/history.routes.js';
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// CORS
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/persons', personsRoutes);
app.use('/api/kattalu', kattaluRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/history', historyRoutes);
app.use("/api/payments", paymentRoutes);


// Graceful error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error', data: null });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found', data: null });
});

export default app;
