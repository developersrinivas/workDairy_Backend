// src/controllers/persons.controller.js
import { ok, fail } from '../utils/response.js';
import * as personsService from '../services/persons.service.js';
import * as bookingService from '../services/booking.service.js';
import * as paymentService from '../services/payment.service.js';

export async function list(req, res) {
  const list = await personsService.listPersons();
  return ok(res, list);
}

// export async function ledger(req, res) {
//   const id = req.params.id;
//   console.log(id,"id");

//   const person = await personsService.getPerson(id);  // 👈 GET PERSON DETAILS

//   if (!person) return fail(res, "Person not found", 404);

//   const bookings = await bookingService.listBookings();
//   const filtered = bookings.filter(entry =>
//     (entry.persons || []).some(p => p.id === id)
//   );

//   const payments = await paymentService.getByPersonId(id);

//   return ok(res, {
//     person,
//     bookings: filtered,
//     payments
//   });
// }
export async function ledger(req, res) {
  try {
    const id = req.params.id;

    // 👉 1. Person Details
    const person = await personsService.getPerson(id);
    if (!person) return fail(res, "Person not found", 404);
    // console.log(person, "person");

    // 👉 2. Get Bookings from MongoDB where user is a member
    const bookings = await bookingService.findByPerson(id);
    // console.log(bookings, "bookings");

    // 👉 3. Get Payments from MongoDB for this person
    const payments = await paymentService.getByPersonId(id);
    // console.log(payments, "payments");


    console.log({
      person,
      bookings,
      payments
    })
    return ok(res, {
      person,
      bookings,
      payments
    });

  } catch (err) {
    console.log("Ledger Error:", err);
    return fail(res, "Failed to load ledger", 500);
  }
}

export async function create(req, res) {
  const { name, phone } = req.body || {};
  if (!name || name.trim() === '') return fail(res, 'Name is required', 400);
  // phone optional but if provided validate basic digits
  if (phone && !/^[0-9()+\-\s]+$/.test(phone)) return fail(res, 'Phone contains invalid chars', 400);

  const item = await personsService.createPerson({ name: name.trim(), phone });
  return ok(res, item, 'Person created');
}

export async function update(req, res) {
  const id = req.params.id;
  const { name, phone, isActive } = req.body || {};
  if (name !== undefined && name.trim() === '') return fail(res, 'Name cannot be empty', 400);

  const updated = await personsService.updatePerson(id, { ...(name !== undefined ? { name } : {}), phone, isActive });
  if (!updated) return fail(res, 'Person not found', 404);
  return ok(res, updated, 'Person updated');
}

export async function remove(req, res) {
  const id = req.params.id;
  await personsService.deletePerson(id);
  return ok(res, null, 'Person deleted');
}
