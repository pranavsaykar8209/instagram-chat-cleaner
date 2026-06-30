import fs from 'fs';
import path from 'path';
import { SESSION_PATH } from '../config/constants.js';

export function getStorageStatePath() {
  if (fs.existsSync(SESSION_PATH)) {
    return SESSION_PATH;
  }
  return undefined;
}

export async function saveSession(context) {
  const dir = path.dirname(SESSION_PATH);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await context.storageState({ path: SESSION_PATH });
  console.log(`[Session] Authenticated session saved to ${SESSION_PATH}`);
}
