// src/services/payment.service.js
import Payment from "../models/payment.model.js";

/**
 * 👉 Create Payment
 * @param {*} payload { labourId/personId, amount, date, notes }
 * @returns saved payment
 */
export async function addPayment(payload) {
  const payment = new Payment({
    labourId: payload.labourId || payload.personId, // support both naming
    amount: payload.amount,
    date: payload.date || new Date(),
    notes: payload.notes || ""
  });

  return await payment.save();
}

/**
 * 👉 List all payments
 */
export async function listPayments() {
  return await Payment.find().sort({ date: -1 });
}

/**
 * 👉 Get all payments of a person/labour
 */
export async function getByPersonId(personId) {
  return await Payment.find({ labourId: personId }).sort({ date: -1 });
}

/**
 * 👉 Delete Payment
 */
export async function deletePayment(id) {
  return await Payment.findByIdAndDelete(id);
}
