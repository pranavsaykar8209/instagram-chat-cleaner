import { launchBrowser } from './browser/launch.js';
import { INSTAGRAM_URL } from './config/constants.js';
import { authenticateUser } from './auth/login.js';

async function main() {
  console.log('Starting Instagram Chat Cleaner...');
  
  try {
    const { browser, context, page } = await launchBrowser();
    
    console.log(`[Navigation] Navigating to ${INSTAGRAM_URL}...`);
    
    // Wait until the page has fully loaded using Playwright's built-in mechanism
    await page.goto(INSTAGRAM_URL, { waitUntil: 'load' });
    
    const pageTitle = await page.title();
    console.log(`[Navigation] Page fully loaded. Title: "${pageTitle}"`);
    
    await authenticateUser(page, context);
    
    console.log('\n========================================');
    console.log('Step 3 Complete: Authentication & Session Persistence.');
    console.log('You can now verify the authenticated state in the browser.');
    console.log('Close the browser manually or stop the script to exit.');
    console.log('========================================\n');
    
  } catch (error) {
    // If navigation fails, throw the error instead of silently handling it
    console.error('An error occurred during Step 3:');
    throw error;
  }
}

// Start the application
main();
