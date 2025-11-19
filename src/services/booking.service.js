// src/services/booking.service.js
import { readJSON, writeJSON } from '../utils/storage.js';

const FILE = 'bookings.json';

export async function listBookings() {
  return (await readJSON(FILE)) || [];
}

export async function saveBooking(booking) {
  const items = await listBookings();
  items.push(booking);
  await writeJSON(FILE, items);
  return booking;
}

export async function getBookingsByDate(dateStr) {
  const items = await listBookings();
  return items.filter(b => (b.date || b.createdAt || '').startsWith(dateStr));
}

export async function listBookingsFiltered({ type, date }) {
  let items = await listBookings();
  if (type) items = items.filter(i => i.type === type);
  if (date) items = items.filter(i => (i.date || i.createdAt || '').startsWith(date));
  return items;
}
