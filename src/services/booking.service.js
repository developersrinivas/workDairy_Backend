// src/services/booking.service.js
import Booking from '../models/booking.model.js';

export async function listBookings() {
  // old code: just array
  const docs = await Booking.find().sort({ createdAt: 1 }).lean({ virtuals: true });
  return docs;
}

export async function saveBooking(booking) {
  // booking payload coming from controllers (kattalu/trip)
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
  // original: filter by startsWith(dateStr)
  const docs = await Booking.find({
    date: new RegExp(`^${dateStr}`), // safeguards for same behaviour
  })
    .sort({ createdAt: 1 })
    .lean({ virtuals: true });

  return docs;
}

export async function listBookingsFiltered({ type, date }) {
  const query = {};
  if (type) query.type = type;
  if (date) query.date = new RegExp(`^${date}`);

  const docs = await Booking.find(query)
    .sort({ createdAt: 1 })
    .lean({ virtuals: true });

  return docs;
}
