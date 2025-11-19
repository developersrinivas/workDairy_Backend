const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  labourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Labour',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: 0,
  },
  date: {
    type: Date,
    required: [true, 'Payment date is required'],
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

paymentSchema.index({ labourId: 1, date: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
