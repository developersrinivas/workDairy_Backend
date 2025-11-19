// src/services/user.service.js
import { readJSON, writeJSON } from '../utils/storage.js';

const USERS_FILE = 'users.json';

export async function getAllUsers() {
  const u = (await readJSON(USERS_FILE)) || [];
  return u;
}

export async function findUserByEmail(email) {
  const users = await getAllUsers();
  return users.find(u => u.email === email);
}

export async function addUser(user) {
  const users = (await getAllUsers()) || [];
  users.push(user);
  await writeJSON(USERS_FILE, users);
  return user;
}
