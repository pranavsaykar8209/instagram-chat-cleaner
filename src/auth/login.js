import { SELECTORS } from '../selectors/instagram.js';
import { saveSession } from '../browser/session.js';

async function handleCookiePopup(page) {
  try {
    // Wait briefly for a cookie button. We race them because either could appear depending on region.
    const cookieButton = await Promise.race([
      page.waitForSelector(SELECTORS.COOKIE_ALLOW_BUTTON, { timeout: 3000 }).catch(() => null),
      page.waitForSelector(SELECTORS.COOKIE_DECLINE_BUTTON, { timeout: 3000 }).catch(() => null)
    ]);
    
    if (cookieButton) {
      console.log('[Auth] Cookie consent popup detected. Handling it...');
      await cookieButton.click();
    }
  } catch (error) {
    // Ignore errors here. If the popup isn't present, that's perfectly fine.
  }
}

export async function authenticateUser(page, context) {
  console.log('[Auth] Checking login state...');
  
  await handleCookiePopup(page);

  // Check if we are logged in by racing the home indicator and the login input
  let isLoggedIn = false;
  try {
    const loginStatus = await Promise.race([
      page.waitForSelector(SELECTORS.HOME_INDICATOR, { timeout: 10000 }).then(() => 'logged_in'),
      page.waitForSelector(SELECTORS.LOGIN_USERNAME_INPUT, { timeout: 10000 }).then(() => 'logged_out'),
    ]);

    if (loginStatus === 'logged_in') {
      console.log('[Auth] Session is valid. User is already logged in.');
      isLoggedIn = true;
    } else {
      console.log('[Auth] Session invalid or missing (Logged out).');
    }
  } catch (error) {
    console.log('[Auth] Could not determine login state automatically, assuming logged out.');
  }

  if (!isLoggedIn) {
    console.log('[Auth] Please log in manually in the browser window.');
    console.log('[Auth] Waiting for successful login (Home feed to appear)...');

    // Wait indefinitely (timeout: 0) for the user to finish logging in.
    // We know login is successful when the home indicator appears.
    await page.waitForSelector(SELECTORS.HOME_INDICATOR, { timeout: 0 });
    
    // Wait until network activity settles to ensure all auth cookies are fully set
    await page.waitForLoadState('networkidle');
    
    console.log('[Auth] Login successful!');
    await saveSession(context);
  }
}
