// src/controllers/payment.controller.js
import { ok, fail } from "../utils/response.js";
import * as personsService from "../services/persons.service.js";
import * as paymentService from "../services/payment.service.js";

export async function create(req, res) {
  const { personId, amount, note, date } = req.body || {};

  if (!personId) return fail(res, "personId required", 400);
  if (!amount || amount <= 0) return fail(res, "Amount must be > 0", 400);

  // ✅ check if person exists
  const person = await personsService.getPerson(personId);
  if (!person) return fail(res, "Person not found", 404);

  // ✅ save payment
  const item = await paymentService.createPayment({
    personId,
    amount,
    note,
    date,
  });

  return ok(res, item, "Payment added");
}

export async function listByPerson(req, res) {
  const { id } = req.params;

  const list = await paymentService.getByPersonId(id);
  return ok(res, list);
}
