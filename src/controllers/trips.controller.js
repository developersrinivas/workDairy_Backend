// src/controllers/trips.controller.js
import { ok, fail } from '../utils/response.js';
import * as bookingService from '../services/booking.service.js';
import * as personsService from '../services/persons.service.js';

function nowISO() { return new Date().toISOString(); }

export async function createTrip(req, res) {
  const body = req.body || {};

  const tripPrice = Number(body.tripPrice || 0);
  const shareType = body.shareType || 'equal';
  const members = Array.isArray(body.members) ? body.members : [];
  const receiverName = body.receiverName || '';

  if (!tripPrice || tripPrice <= 0) return fail(res, 'tripPrice must be > 0', 400);
  if (!members.length) return fail(res, 'At least one member required', 400);
  if (!['equal', 'custom'].includes(shareType)) return fail(res, 'shareType must be equal or custom', 400);

  // validate members exist
  const allPersons = await personsService.listPersons();
  const invalid = members.find(id => !allPersons.find(p => p.id === id));
  if (invalid) return fail(res, `Member id ${invalid} not found`, 400);

  let persons = [];
  if (shareType === 'equal') {
    const perPerson = tripPrice / members.length;
    persons = members.map(id => ({ id, amount: Number(perPerson.toFixed(2)) }));
  } else {
    // custom: validate persons array provided
    const customPersons = Array.isArray(body.persons) ? body.persons : [];
    if (customPersons.length !== members.length) return fail(res, 'custom share requires persons array with same length as members', 400);
    const totalCustom = customPersons.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    if (Math.abs(totalCustom - tripPrice) > 0.01) return fail(res, 'custom amounts must sum to tripPrice', 400);
    persons = customPersons.map(p => ({ id: p.id, amount: Number(p.amount) }));
  }

  const booking = {
    id: String(Date.now()) + Math.floor(Math.random() * 999),
    type: 'trip',
    date: body.date || (new Date()).toISOString().slice(0, 10),
    tripPrice: Number(tripPrice.toFixed(2)),
    persons,
    shareType,
    members,
    receiverName,
    createdAt: nowISO()
  };

  await bookingService.saveBooking(booking);
  return ok(res, booking, 'Trip saved');
}

export async function listTrips(req, res) {
  const { date } = req.query || {};
  const items = await bookingService.listBookingsFiltered({ type: 'trip', date });
  return ok(res, items);
}
