import { launchBrowser } from './browser/launch.js';
import { INSTAGRAM_URL } from './config/constants.js';
import { authenticateUser } from './auth/login.js';
import { runCleaner } from './chat/cleaner.js';

async function main() {
  console.log('Starting Instagram Chat Cleaner...');
  
  try {
    const { browser, context, page } = await launchBrowser();
    
    console.log(`[Navigation] Navigating to ${INSTAGRAM_URL}...`);
    
    // Wait until the page has fully loaded using Playwright's built-in mechanism
    await page.goto(INSTAGRAM_URL, { waitUntil: 'load' });
    
    const pageTitle = await page.title();
    console.log(`[Navigation] Page fully loaded. Title: "${pageTitle}"`);
    
    // Step 3: Auth flow
    await authenticateUser(page, context);
    
    // Step 5: Run the message cleaner
    await runCleaner(page);
    
    // Keep the browser open after inspection so the user can verify
    
  } catch (error) {
    // If navigation fails, throw the error instead of silently handling it
    console.error('An error occurred:');
    throw error;
  }
}

// Start the application
main();
