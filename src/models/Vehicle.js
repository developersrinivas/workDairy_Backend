const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['tractor', 'cart'],
  },
  capacity: {
    type: Number,
    required: [true, 'Vehicle capacity is required'],
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
