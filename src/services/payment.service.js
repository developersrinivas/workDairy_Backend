import Payment from '../models/payment.model.js';

export async function getByPersonId(personId) {
  return await Payment.find({ personId }).sort({ createdAt: -1 }).lean();
}

export async function createPayment(payload) {
  return await Payment.create({
    personId: payload.personId,
    amount: payload.amount,
    note: payload.note || '',
    date: payload.date
  });
}
