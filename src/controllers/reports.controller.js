const Trip = require('../models/Trip');
const Payment = require('../models/Payment');
const { generateTripsCSV, generatePaymentsCSV } = require('../utils/csv.utils');
const { asyncHandler } = require('../middleware/error.middleware');

const getTripReports = asyncHandler(async (req, res) => {
  const {
    dateFrom,
    dateTo,
    vehicleId,
    page = 1,
    limit = 10,
    format = 'json',
  } = req.query;

  const query = {};

  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }

  if (vehicleId) {
    query.vehicleId = vehicleId;
  }

  if (format === 'csv') {
    const trips = await Trip.find(query)
      .populate('vehicleId', 'name type capacity')
      .populate('createdBy', 'name email')
      .populate('loads.labourAssignments.labourId', 'name phone')
      .sort({ date: -1 });

    return generateTripsCSV(trips, res);
  }

  const trips = await Trip.find(query)
    .populate('vehicleId', 'name type capacity')
    .populate('createdBy', 'name email')
    .sort({ date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Trip.countDocuments(query);

  res.json({
    success: true,
    data: {
      trips,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getPaymentReports = asyncHandler(async (req, res) => {
  const {
    dateFrom,
    dateTo,
    labourId,
    page = 1,
    limit = 10,
    format = 'json',
  } = req.query;

  const query = {};

  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }

  if (labourId) {
    query.labourId = labourId;
  }

  if (format === 'csv') {
    const payments = await Payment.find(query)
      .populate('labourId', 'name phone')
      .sort({ date: -1 });

    return generatePaymentsCSV(payments, res);
  }

  const payments = await Payment.find(query)
    .populate('labourId', 'name phone')
    .sort({ date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Payment.countDocuments(query);

  res.json({
    success: true,
    data: {
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const [
    totalTrips,
    todayTrips,
    monthlyTrips,
    yearlyTrips,
    totalRevenue,
    monthlyRevenue,
    yearlyRevenue,
    recentTrips,
  ] = await Promise.all([
    Trip.countDocuments(),
    Trip.countDocuments({
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999)),
      },
    }),
    Trip.countDocuments({ date: { $gte: startOfMonth } }),
    Trip.countDocuments({ date: { $gte: startOfYear } }),
    Trip.aggregate([
      { $group: { _id: null, total: { $sum: '$totals.totalAmount' } } },
    ]),
    Trip.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totals.totalAmount' } } },
    ]),
    Trip.aggregate([
      { $match: { date: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: '$totals.totalAmount' } } },
    ]),
    Trip.find()
      .populate('vehicleId', 'name type')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        trips: {
          total: totalTrips,
          today: todayTrips,
          monthly: monthlyTrips,
          yearly: yearlyTrips,
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          monthly: monthlyRevenue[0]?.total || 0,
          yearly: yearlyRevenue[0]?.total || 0,
        },
      },
      recentTrips,
    },
  });
});

const getLabourEarnings = asyncHandler(async (req, res) => {
  const { dateFrom, dateTo, labourId } = req.query;

  const matchStage = {};
  
  if (dateFrom || dateTo) {
    matchStage.date = {};
    if (dateFrom) matchStage.date.$gte = new Date(dateFrom);
    if (dateTo) matchStage.date.$lte = new Date(dateTo);
  }

  const pipeline = [
    { $match: matchStage },
    { $unwind: '$loads' },
    { $unwind: '$loads.labourAssignments' },
    {
      $group: {
        _id: '$loads.labourAssignments.labourId',
        totalEarned: { $sum: '$loads.labourAssignments.amountPaid' },
        tripsWorked: { $addToSet: '$_id' },
      },
    },
    {
      $addFields: {
        tripCount: { $size: '$tripsWorked' },
      },
    },
    {
      $lookup: {
        from: 'labours',
        localField: '_id',
        foreignField: '_id',
        as: 'labour',
      },
    },
    { $unwind: '$labour' },
    {
      $project: {
        labourName: '$labour.name',
        labourPhone: '$labour.phone',
        totalEarned: 1,
        tripCount: 1,
        avgPerTrip: { $divide: ['$totalEarned', '$tripCount'] },
      },
    },
    { $sort: { totalEarned: -1 } },
  ];

  if (labourId) {
    pipeline.splice(1, 0, {
      $match: { 'loads.labourAssignments.labourId': new mongoose.Types.ObjectId(labourId) },
    });
  }

  const earnings = await Trip.aggregate(pipeline);

  res.json({
    success: true,
    data: {
      earnings,
    },
  });
});

module.exports = {
  getTripReports,
  getPaymentReports,
  getDashboardStats,
  getLabourEarnings,
};
