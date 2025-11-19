// src/models/person.model.js
import mongoose from 'mongoose';

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// front-end ki `id` kavali, _id kakunda:
personSchema.set('toJSON', {
  virtuals: true, // adds `id` getter from _id
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
    return ret;
  },
});

const Person = mongoose.model('Person', personSchema);
export default Person;
