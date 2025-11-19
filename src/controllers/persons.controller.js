// src/controllers/persons.controller.js
import { ok, fail } from '../utils/response.js';
import * as personsService from '../services/persons.service.js';

export async function list(req, res) {
  const list = await personsService.listPersons();
  return ok(res, list);
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
