// src/models/payment.model.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  labourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person', // 🔥 important: ref must match persons model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: new Date()
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

paymentSchema.index({ labourId: 1, date: -1 });

export default mongoose.model("Payment", paymentSchema);
