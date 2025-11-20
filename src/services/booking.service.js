// src/services/booking.service.js
import Booking from '../models/booking.model.js';

export async function listBookings() {
  return await Booking.find().sort({ createdAt: -1 }).lean();
}

export async function saveBooking(booking) {
  const doc = await Booking.create({
    type: booking.type,
    date: booking.date,
    noOfKattalu: booking.noOfKattalu,
    pricePerKatta: booking.pricePerKatta,
    total: booking.total,
    perPerson: booking.perPerson,
    tripPrice: booking.tripPrice,
    shareType: booking.shareType,
    persons: booking.persons || [],
    members: booking.members || [],
    receiverName: booking.receiverName || '',
  });
  return doc.toJSON();
}

export async function getBookingsByDate(dateStr) {
  return await Booking.find({
    date: new RegExp(`^${dateStr}`)
  }).sort({ createdAt: -1 }).lean();
}

export async function listBookingsFiltered({ type, date }) {
  const query = {};
  if (type) query.type = type;
  if (date) query.date = new RegExp(`^${date}`);

  return await Booking.find(query).sort({ createdAt: -1 }).lean();
}

/* 🚀 NEW METHOD  (Required for Ledger) */
export async function findByPerson(personId) {
  return await Booking.find({
    members: personId
  }).sort({ createdAt: -1 }).lean();
}
