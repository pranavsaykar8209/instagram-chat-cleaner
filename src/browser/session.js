import fs from 'fs';
import { SESSION_PATH } from '../config/constants.js';

/**
 * Returns the path to the storage state file if it exists.
 * Used when initializing the browser context to load previous cookies/local storage.
 */
export function getStorageStatePath() {
  if (fs.existsSync(SESSION_PATH)) {
    return SESSION_PATH;
  }
  return undefined;
}

/**
 * Saves the current browser context's storage state (cookies, local storage) to a file.
 * This allows reusing the session on subsequent runs without logging in again.
 */
export async function saveSession(context) {
  // Ensure the directory exists
  const dir = new URL('../../playwright/.auth', import.meta.url).pathname;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await context.storageState({ path: SESSION_PATH });
  console.log(`[Session] Saved authenticated session to ${SESSION_PATH}`);
}
