import { chromium } from 'playwright';
import { getStorageStatePath } from './session.js';

/**
 * Launches a Playwright browser, creates a context with optional saved session,
 * and opens a new page.
 */
export async function launchBrowser() {
  console.log('[Browser] Launching Playwright browser...');
  
  // headless: false is required because we need the user to manually log in if no session exists.
  const browser = await chromium.launch({
    headless: false,
  });

  const storageState = getStorageStatePath();
  if (storageState) {
    console.log('[Browser] Found existing session file. Attempting to reuse session.');
  } else {
    console.log('[Browser] No existing session file found. A new session will be created.');
  }

  const context = await browser.newContext({
    storageState,
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();
  
  return { browser, context, page };
}
