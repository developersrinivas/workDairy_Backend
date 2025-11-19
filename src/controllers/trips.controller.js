// src/controllers/trips.controller.js
import { ok, fail } from '../utils/response.js';
import * as bookingService from '../services/booking.service.js';
import * as personsService from '../services/persons.service.js';

function nowISO() { return new Date().toISOString(); }

function normalizeId(value) {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    if (value.id) return String(value.id);
    if (value._id) return String(value._id);
  }
  return null;
}

function normalizeIds(list) {
  return list.map(normalizeId).filter(Boolean);
}

export async function createTrip(req, res) {
  const body = req.body || {};

  const tripPrice = Number(body.tripPrice || 0);
  const shareType = body.shareType || 'equal';
  const membersInput = Array.isArray(body.members) ? body.members : [];
  const memberIds = normalizeIds(membersInput);
  const receiverName = body.receiverName || '';

  if (!tripPrice || tripPrice <= 0) return fail(res, 'tripPrice must be > 0', 400);
  if (!memberIds.length) return fail(res, 'At least one member required', 400);
  if (memberIds.length !== membersInput.length) return fail(res, 'Each member must include a valid id', 400);
  if (!['equal', 'custom'].includes(shareType)) return fail(res, 'shareType must be equal or custom', 400);

  // validate members exist
  const allPersons = await personsService.listPersons();
  const personIdSet = new Set(allPersons.map(p => String(p.id ?? p._id)));
  const invalid = memberIds.find(id => !personIdSet.has(id));
  if (invalid) return fail(res, `Member id ${invalid} not found`, 400);

  let persons = [];
  if (shareType === 'equal') {
    const perPerson = tripPrice / memberIds.length;
    persons = memberIds.map(id => ({ id, amount: Number(perPerson.toFixed(2)) }));
  } else {
    // custom: validate persons array provided
    const customPersonsInput = Array.isArray(body.persons) ? body.persons : [];
    if (customPersonsInput.length !== memberIds.length) return fail(res, 'custom share requires persons array with same length as members', 400);

    const customPersons = customPersonsInput.map(p => ({
      id: normalizeId(p?.id ?? p?._id ?? p),
      amount: Number(p?.amount || 0)
    }));

    if (customPersons.some(p => !p.id)) return fail(res, 'Each custom person must include a valid id', 400);
    const memberSet = new Set(memberIds);
    const invalidCustom = customPersons.find(p => !memberSet.has(p.id));
    if (invalidCustom) return fail(res, `Custom person id ${invalidCustom.id} must match members list`, 400);

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
    members: memberIds,
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
