// src/models/booking.model.js
import mongoose from "mongoose";

const PersonShareSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // Person.id string గా front-end కే maintain
    amount: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["kattalu", "trip"],
      required: true
    },

    date: {
      type: String, // YYYY-MM-DD 그대로 ఉంచాలి (front end filtering same)
      required: true
    },

    // ======= KATTALU =======
    noOfKattalu: Number,
    pricePerKatta: Number,
    total: Number,
    perPerson: Number,

    // ======= TRIP =======
    tripPrice: Number,
    shareType: { type: String, enum: ["equal", "custom"] },

    // ======= COMMON =======
    persons: [PersonShareSchema], // [{id, amount}]
    members: [String], // ["personid","personid"]
    receiverName: { type: String, trim: true }
  },
  {
    timestamps: true
  }
);

// id ను provide చేస్తుంది, _id కాదు
BookingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
    return ret;
  }
});

export default mongoose.model("Booking", BookingSchema);
