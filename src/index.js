import { launchBrowser } from './browser/launch.js';
import { ensureLoggedIn } from './auth/login.js';

async function main() {
  console.log('Starting Instagram Chat Cleaner...');
  
  const { browser, context, page } = await launchBrowser();
  
  try {
    const isLoggedIn = await ensureLoggedIn(page, context);
    
    if (isLoggedIn) {
      console.log('\n========================================');
      console.log('Phase 1 Complete: Browser launched and session authenticated successfully.');
      console.log('========================================\n');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
  }
}

// Start the application
main();
