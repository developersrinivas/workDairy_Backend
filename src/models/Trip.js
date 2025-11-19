const mongoose = require('mongoose');

const labourAssignmentSchema = new mongoose.Schema({
  labourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Labour',
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 0,
  },
  roleNotes: {
    type: String,
    trim: true,
  },
});

const loadSchema = new mongoose.Schema({
  loadNo: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    enum: ['per_load', 'per_member', 'per_unit', 'mixed', 'gaddulu', 'trip_share'],
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  unit: {
    type: String,
    trim: true,
  },
  membersCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  rateOverride: {
    type: Number,
    min: 0,
  },
  totalGaddulu: {
    type: Number,
    min: 0,
  },
  ratePerGaddu: {
    type: Number,
    min: 0,
  },
  tripsCount: {
    type: Number,
    min: 0,
  },
  ratePerTrip: {
    type: Number,
    min: 0,
  },
  labourCount: {
    type: Number,
    min: 0,
  },
  amount: {
    type: Number,
    default: 0,
    min: 0,
  },
  sharePerMember: {
    type: Number,
    default: 0,
    min: 0,
  },
  sharePerLabour: {
    type: Number,
    default: 0,
    min: 0,
  },
  labourAssignments: [labourAssignmentSchema],
});

const tripSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Trip date is required'],
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  vehicleCount: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  routeFrom: {
    type: String,
    required: [true, 'Route from is required'],
    trim: true,
  },
  routeTo: {
    type: String,
    required: [true, 'Route to is required'],
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  loads: [loadSchema],
  totals: {
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalLoads: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalMembers: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  settingsUsed: {
    mode: {
      type: String,
      enum: ['per_load', 'per_member', 'per_unit', 'mixed'],
    },
    ratesSnapshot: {
      per_load_rate: Number,
      per_member_rate: Number,
      per_unit_rate: Number,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

tripSchema.index({ date: -1 });
tripSchema.index({ vehicleId: 1, date: -1 });

module.exports = mongoose.model('Trip', tripSchema);
