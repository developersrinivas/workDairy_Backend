const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Labour name is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  rateType: {
    type: String,
    required: [true, 'Rate type is required'],
    enum: ['per_day', 'per_load', 'per_unit'],
  },
  defaultRate: {
    type: Number,
    required: [true, 'Default rate is required'],
    min: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Labour', labourSchema);
