import { chromium } from 'playwright';
import { getStorageStatePath } from './session.js';

/**
 * Launches a Playwright browser, creates a context, and opens a new page.
 */
export async function launchBrowser() {
  console.log('[Browser] Launching Playwright browser in headed mode...');
  
  const browser = await chromium.launch({
    headless: false,
  });

  const storageState = getStorageStatePath();
  if (storageState) {
    console.log('[Browser] Found existing session file. Launching with saved storage state.');
  } else {
    console.log('[Browser] No existing session file found. A new session will be created.');
  }

  // Set to a smaller viewport (1024x768) so it doesn't get cut off on smaller laptop screens
  const context = await browser.newContext({
    storageState,
    viewport: { width: 1024, height: 768 }
  });
  
  const page = await context.newPage();
  
  return { browser, context, page };
}
