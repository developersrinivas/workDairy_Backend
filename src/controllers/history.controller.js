// src/controllers/history.controller.js
import { ok } from '../utils/response.js';
import * as bookingService from '../services/booking.service.js';

function getDateKey(item) {
  // prefer explicit date field (YYYY-MM-DD) else createdAt date portion
  const d = item.date || item.createdAt || '';
  return (typeof d === 'string' && d.length >= 10) ? d.slice(0, 10) : d;
}

export async function history(req, res) {
  const all = await bookingService.listBookings();
  // group
  const groups = {};
  for (const b of all) {
    const k = getDateKey(b) || 'unknown';
    groups[k] = groups[k] || [];
    groups[k].push(b);
  }
  // sort keys descending
  const keys = Object.keys(groups).sort((a, b) => (b > a ? 1 : -1));
  const result = {};
  for (const k of keys) {
    // sort bookings within date by createdAt descending
    result[k] = (groups[k] || []).sort((x, y) => (y.createdAt || '').localeCompare(x.createdAt || ''));
  }
  return ok(res, result);
}
