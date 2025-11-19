const Vehicle = require('../models/Vehicle');
const { asyncHandler } = require('../middleware/error.middleware');

const createVehicle = asyncHandler(async (req, res) => {
  const { name, type, capacity, notes } = req.body;

  const vehicle = await Vehicle.create({
    name,
    type,
    capacity,
    notes,
  });

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    data: {
      vehicle,
    },
  });
});

const getVehicles = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 10 } = req.query;

  const query = {};
  if (type) {
    query.type = type;
  }

  const vehicles = await Vehicle.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Vehicle.countDocuments(query);

  res.json({
    success: true,
    data: {
      vehicles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found',
    });
  }

  res.json({
    success: true,
    data: {
      vehicle,
    },
  });
});

const updateVehicle = asyncHandler(async (req, res) => {
  const { name, type, capacity, notes } = req.body;

  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found',
    });
  }

  if (name) vehicle.name = name;
  if (type) vehicle.type = type;
  if (capacity !== undefined) vehicle.capacity = capacity;
  if (notes !== undefined) vehicle.notes = notes;

  await vehicle.save();

  res.json({
    success: true,
    message: 'Vehicle updated successfully',
    data: {
      vehicle,
    },
  });
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found',
    });
  }

  await vehicle.remove();

  res.json({
    success: true,
    message: 'Vehicle deleted successfully',
  });
});

module.exports = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
