// src/controllers/kattalu.controller.js
import { ok, fail } from '../utils/response.js';
import * as bookingService from '../services/booking.service.js';
import * as personsService from '../services/persons.service.js';

function nowISO() { return new Date().toISOString(); }

export async function createKattalu(req, res) {
  const body = req.body || {};
  console.log(body,"body");

  const noOfKattalu = Number(body.noOfKattalu || 0);
  const pricePerKatta = Number(body.pricePerKatta || 0);
  const members = Array.isArray(body.members) ? body.members : [];
  const receiverName = body.receiverName || '';

  if (!noOfKattalu || noOfKattalu <= 0) return fail(res, 'noOfKattalu must be > 0', 400);
  if (!pricePerKatta || pricePerKatta < 0) return fail(res, 'pricePerKatta must be >= 0', 400);
  if (!members.length) return fail(res, 'At least one member required', 400);

  // 🔥 MongoDB persons validation
  const allPersons = await personsService.listPersons();
  const invalid = members.find(id => !allPersons.find(p => p._id?.toString() === id));
  if (invalid) return fail(res, `Member id ${invalid} not found`, 400);

  const total = noOfKattalu * pricePerKatta;
  const perPerson = total / members.length;

  // 🔥 Save person shares using Mongo id strings
  const persons = members.map(id => ({ id, amount: Number(perPerson.toFixed(2)) }));
  console.log(members,"members");
  console.log(persons,"persons");

  const booking = {
    id: String(Date.now()) + Math.floor(Math.random() * 999),
    type: 'kattalu',
    date: body.date || (new Date()).toISOString().slice(0, 10),
    noOfKattalu,
    pricePerKatta,
    total: Number(total.toFixed(2)),
    perPerson: Number(perPerson.toFixed(2)),
    persons,
    members,
    receiverName,
    createdAt: nowISO()
  };

  await bookingService.saveBooking(booking);
  return ok(res, booking, 'Kattalu booking saved');
}


export async function listKattalu(req, res) {
  const { date } = req.query || {};
  const items = await bookingService.listBookingsFiltered({ type: 'kattalu', date });
  return ok(res, items);
}
