// src/services/user.service.js
import User from '../models/user.model.js';

export async function getAllUsers() {
  const docs = await User.find().lean({ virtuals: true });
  return docs;
}

export async function findUserByEmail(email) {
  const doc = await User.findOne({ email }).lean({ virtuals: true });
  return doc;
}

export async function addUser(user) {
  // `user` should have: { name, email, passwordHash }
  const doc = await User.create(user);
  return doc.toJSON();
}
