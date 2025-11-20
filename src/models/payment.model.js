import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    note: {
      type: String,
      default: "",
    },

    // 🔥 FIX: Provide default type for payments
    type: {
      type: String,
      enum: ["payment"], // only one type for now
      default: "payment",
      required: true,
    },

    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
