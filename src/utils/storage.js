// src/utils/storage.js
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'src', 'data');

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    // ignore
  }
}

export async function readJSON(filename) {
  await ensureDataDir();
  const full = path.join(dataDir, filename);
  try {
    const raw = await fs.readFile(full, 'utf8');
    return JSON.parse(raw || 'null') || null;
  } catch (err) {
    // If file missing or invalid, return null
    return null;
  }
}

export async function writeJSON(filename, data) {
  await ensureDataDir();
  const full = path.join(dataDir, filename);
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(full, content, 'utf8');
}
