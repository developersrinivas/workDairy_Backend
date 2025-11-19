// src/services/persons.service.js
import { readJSON, writeJSON } from '../utils/storage.js';

const FILE = 'persons.json';

function nowISO() {
  return new Date().toISOString();
}

export async function listPersons() {
  return (await readJSON(FILE)) || [];
}

export async function getPerson(id) {
  const items = await listPersons();
  return items.find(x => x.id === id);
}

export async function createPerson(payload) {
  const items = await listPersons();
  const item = {
    id: String(Date.now()) + Math.floor(Math.random() * 999),
    name: payload.name,
    phone: payload.phone || '',
    isActive: payload.isActive !== undefined ? !!payload.isActive : true,
    createdAt: nowISO()
  };
  items.push(item);
  await writeJSON(FILE, items);
  return item;
}

export async function updatePerson(id, payload) {
  const items = await listPersons();
  const idx = items.findIndex(x => x.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...payload };
  await writeJSON(FILE, items);
  return items[idx];
}

export async function deletePerson(id) {
  const items = await listPersons();
  const filtered = items.filter(x => x.id !== id);
  await writeJSON(FILE, filtered);
  return true;
}
