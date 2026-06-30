import { INSTAGRAM_URL } from '../config/constants.js';
import { SELECTORS } from '../selectors/instagram.js';
import { saveSession } from '../browser/session.js';

/**
 * Navigates to Instagram and ensures the user is logged in.
 * If not logged in, waits indefinitely for the user to manually enter their credentials.
 */
export async function ensureLoggedIn(page, context) {
  console.log(`[Auth] Navigating to ${INSTAGRAM_URL}...`);
  await page.goto(INSTAGRAM_URL);

  console.log('[Auth] Checking login state...');
  
  try {
    // Race to determine if we are logged in or logged out.
    // Wait up to 10 seconds to see either the home indicator (logged in) or username input (logged out).
    const loginStatus = await Promise.race([
      page.waitForSelector(SELECTORS.HOME_INDICATOR, { timeout: 10000 }).then(() => 'logged_in'),
      page.waitForSelector(SELECTORS.LOGIN_USERNAME_INPUT, { timeout: 10000 }).then(() => 'logged_out'),
    ]);

    if (loginStatus === 'logged_in') {
      console.log('[Auth] Already logged in. Session is valid.');
      return true;
    }
  } catch (error) {
    console.log('[Auth] Could not determine login state automatically, assuming logged out.');
  }

  console.log('[Auth] Not logged in. Please log in manually in the browser window.');
  console.log('[Auth] Waiting for you to complete login...');

  // Wait indefinitely (timeout: 0) for the user to finish logging in.
  // We know login is successful when the home indicator appears.
  await page.waitForSelector(SELECTORS.HOME_INDICATOR, { timeout: 0 });

  console.log('[Auth] Login successful!');
  
  // Wait a short moment to ensure all cookies and storage items are fully populated
  await page.waitForTimeout(2000);
  
  await saveSession(context);
  return true;
}
