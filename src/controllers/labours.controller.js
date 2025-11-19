const Labour = require('../models/Labour');
const { asyncHandler } = require('../middleware/error.middleware');

const createLabour = asyncHandler(async (req, res) => {
  const { name, phone, rateType, defaultRate } = req.body;

  const labour = await Labour.create({
    name,
    phone,
    rateType,
    defaultRate,
  });

  res.status(201).json({
    success: true,
    message: 'Labour created successfully',
    data: {
      labour,
    },
  });
});

const getLabours = asyncHandler(async (req, res) => {
  const { rateType, page = 1, limit = 10 } = req.query;

  const query = {};
  if (rateType) {
    query.rateType = rateType;
  }

  const labours = await Labour.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Labour.countDocuments(query);

  res.json({
    success: true,
    data: {
      labours,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getLabour = asyncHandler(async (req, res) => {
  const labour = await Labour.findById(req.params.id);

  if (!labour) {
    return res.status(404).json({
      success: false,
      message: 'Labour not found',
    });
  }

  res.json({
    success: true,
    data: {
      labour,
    },
  });
});

const updateLabour = asyncHandler(async (req, res) => {
  const { name, phone, rateType, defaultRate } = req.body;

  const labour = await Labour.findById(req.params.id);

  if (!labour) {
    return res.status(404).json({
      success: false,
      message: 'Labour not found',
    });
  }

  if (name) labour.name = name;
  if (phone !== undefined) labour.phone = phone;
  if (rateType) labour.rateType = rateType;
  if (defaultRate !== undefined) labour.defaultRate = defaultRate;

  await labour.save();

  res.json({
    success: true,
    message: 'Labour updated successfully',
    data: {
      labour,
    },
  });
});

const deleteLabour = asyncHandler(async (req, res) => {
  const labour = await Labour.findById(req.params.id);

  if (!labour) {
    return res.status(404).json({
      success: false,
      message: 'Labour not found',
    });
  }

  await labour.remove();

  res.json({
    success: true,
    message: 'Labour deleted successfully',
  });
});

module.exports = {
  createLabour,
  getLabours,
  getLabour,
  updateLabour,
  deleteLabour,
};
