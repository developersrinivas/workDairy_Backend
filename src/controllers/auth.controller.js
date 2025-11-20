// src/controllers/auth.controller.js
import { ok, fail } from '../utils/response.js';
import * as userService from '../services/user.service.js';
import crypto from 'crypto';

// Mock token generator
function generateMockToken(email) {
  const payload = Buffer.from(email).toString('base64');
  const random = Math.floor(Math.random() * 999999);
  return `mock-token.${payload}.${random}`;
}

export async function register(req, res) {
  const { email, password, name } = req.body || {};
  if (!email || !password) return fail(res, 'Email and password required', 400);

  // Check if user already exists
  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) return fail(res, 'User already exists', 400);

  // Create new user
  const user = await userService.addUser({
    id: String(Date.now()) + Math.floor(Math.random() * 999),
    email,
    name: name || email.split('@')[0],
    createdAt: new Date().toISOString()
  });

  const token = generateMockToken(email);
  return ok(res, { token, user }, 'Registration successful');
}

export const login = (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ success: false, message: "Mobile number is required" });
  }

  const allowedMobiles = ["9951785864", "720736266"]; // allowed numbers
  console.log(mobile,"Mobile")

  if (allowedMobiles.includes(mobile)) {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Not authorized mobile number" });
};

