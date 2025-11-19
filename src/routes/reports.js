const express = require('express');
const {
  getTripReports,
  getPaymentReports,
  getDashboardStats,
  getLabourEarnings,
} = require('../controllers/reports.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(auth);

router.get('/trips', getTripReports);
router.get('/payments', getPaymentReports);
router.get('/dashboard', getDashboardStats);
router.get('/labour-earnings', getLabourEarnings);

module.exports = router;
