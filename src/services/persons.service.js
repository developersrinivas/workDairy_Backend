// src/services/persons.service.js
import Person from '../models/person.model.js';

export async function listPersons() {
  // return array of plain objects with id, name, phone, isActive, createdAt
  return await Person.find().sort({ createdAt: 1 }).lean({ virtuals: true });
}

export async function getPerson(id) {
  return await Person.findById(id).lean({ virtuals: true });
}

export async function createPerson(payload) {
  const doc = await Person.create({
    name: payload.name,
    phone: payload.phone || '',
    isActive:
      payload.isActive !== undefined ? !!payload.isActive : true,
  });
  return doc.toJSON();
}

export async function updatePerson(id, payload) {
  const doc = await Person.findByIdAndUpdate(
    id,
    {
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.isActive !== undefined ? { isActive: !!payload.isActive } : {}),
    },
    { new: true }
  );
  return doc ? doc.toJSON() : null;
}

export async function deletePerson(id) {
  await Person.findByIdAndDelete(id);
  return true;
}
