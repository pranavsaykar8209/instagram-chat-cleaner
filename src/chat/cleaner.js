import { SELECTORS } from '../selectors/instagram.js';
import { MAX_MESSAGES_TO_UNSEND } from '../config/constants.js';

/**
 * cleaner.js implements the core unsend loop (Phases 4-6).
 */
export async function runCleaner(page) {
  console.log('\n========================================');
  console.log('Proceeding to Step 6: Message Cleaner.');
  console.log('========================================\n');
  
  console.log('[Cleaner] Starting Message Cleaner...');
  console.log('[Cleaner] Please navigate to a chat manually in the browser window.');

  await page.waitForURL('**/direct/t/**', { timeout: 0 });
  
  console.log('[Cleaner] Chat detected. Waiting 3 seconds for messages to settle...');
  await page.waitForTimeout(3000);

  const mainFeed = page.getByRole('main');
  await mainFeed.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  
  let unsentCount = 0;
  const DELAY_BETWEEN_MESSAGES_MS = 4000; // Configurable delay to prevent bot detection
  
  if (typeof MAX_MESSAGES_TO_UNSEND === 'number') {
    console.log(`[Cleaner] Configured to unsend a maximum of ${MAX_MESSAGES_TO_UNSEND} messages.`);
  } else {
    console.log(`[Cleaner] Configured to unsend ALL messages in the chat.`);
  }

  while (true) {
    const messageGroups = await mainFeed.getByRole('group').all();
    
    if (messageGroups.length === 0) {
      console.log('[Cleaner] No message groups found in the feed. Waiting and retrying...');
      await page.waitForTimeout(5000);
      continue;
    }

    let processedAny = false;

    // Process from bottom to top (newest to oldest)
    for (let i = messageGroups.length - 1; i >= 0; i--) {
      const group = messageGroups[i];
      
      const contentBubble = group.locator('div[dir="auto"], img, video, audio').first();
      
      if (!(await contentBubble.isVisible().catch(() => false))) {
        continue;
      }
      
      // Determine if sent by me
      const isSentByMe = await group.evaluate((el) => {
        const elements = [el, ...el.querySelectorAll('*')];
        for (const child of elements) {
          const style = window.getComputedStyle(child);
          if (style.alignSelf === 'flex-end' || 
              style.justifyContent === 'flex-end' || 
              style.flexDirection === 'row-reverse') {
            return true;
          }
        }
        return false;
      });

      if (!isSentByMe) {
        continue;
      }

      // Interact to reveal options
      await contentBubble.click({ force: true }).catch(() => {});
      await contentBubble.hover({ force: true }).catch(() => {});
      await page.waitForTimeout(250);

      const optionsBtn = page.getByRole('button', { name: SELECTORS.MESSAGE_OPTIONS_BUTTON.replace(/\[aria-label="|"]/g, '') }).first();
      if (!(await optionsBtn.isVisible().catch(() => false))) {
        // Fallback to CSS selector if getByRole fails
        const cssOptionsBtn = page.locator(SELECTORS.MESSAGE_OPTIONS_BUTTON).first();
        if (await cssOptionsBtn.isVisible().catch(() => false)) {
            await cssOptionsBtn.click();
        } else {
            continue; // Could not trigger options
        }
      } else {
          await optionsBtn.click();
      }
      
      await page.waitForTimeout(700);

      // Click Unsend in menu (Playwright often sees it as a button)
      const unsendMenuBtn = page.getByRole('button', { name: SELECTORS.UNSEND_MENU_ITEM }).first();
      if (!(await unsendMenuBtn.isVisible().catch(() => false))) {
         // Can't be unsent (maybe a shared post that doesn't allow unsend), close menu
         await page.keyboard.press('Escape');
         await page.waitForTimeout(500);
         continue;
      }
      await unsendMenuBtn.click();
      
      await page.waitForTimeout(700);

      // Click Confirm Unsend in dialog
      // Instagram uses a dialog overlay. We look for the Unsend button inside it.
      const dialog = page.getByRole('dialog').first();
      if (await dialog.isVisible().catch(() => false)) {
        const confirmBtn = dialog.getByRole('button', { name: SELECTORS.UNSEND_CONFIRM_DIALOG_BUTTON }).first();
        await confirmBtn.click().catch(() => {});
      } else {
        // Fallback if dialog role is missing: just click the second "Unsend" button on screen
        const fallbackConfirm = page.getByRole('button', { name: SELECTORS.UNSEND_CONFIRM_DIALOG_BUTTON }).nth(1);
        await fallbackConfirm.click().catch(() => {});
      }

      unsentCount++;
      console.log(`[Cleaner] Unsent message #${unsentCount}. Waiting ${DELAY_BETWEEN_MESSAGES_MS}ms...`);
      processedAny = true;
      
      if (typeof MAX_MESSAGES_TO_UNSEND === 'number' && unsentCount >= MAX_MESSAGES_TO_UNSEND) {
        console.log(`[Cleaner] Reached the configured limit of ${MAX_MESSAGES_TO_UNSEND} messages. Stopping script!`);
        return; // Exits the runCleaner function entirely
      }
      
      // Wait to avoid rate limits
      await page.waitForTimeout(DELAY_BETWEEN_MESSAGES_MS);
      
      // Break out of the inner loop to rescan the DOM because elements have shifted after deletion
      break; 
    }

    if (!processedAny) {
      console.log('[Cleaner] No more messages sent by you are visible on screen.');
      console.log('[Cleaner] Attempting to scroll up to load older messages...');
      
      // Hover over the main feed and scroll up
      const firstGroup = messageGroups[0];
      await firstGroup.hover().catch(() => {});
      
      // Scroll by dispatching a wheel event or pressing PageUp
      await page.mouse.wheel(0, -2000);
      await page.keyboard.press('PageUp');
      await page.keyboard.press('PageUp');
      
      // Wait for potential new messages to load
      await page.waitForTimeout(4000);
      
      const newGroups = await mainFeed.getByRole('group').all();
      if (newGroups.length === messageGroups.length) {
        console.log('[Cleaner] Reached the top of the chat or no more messages can be loaded. Done!');
        break;
      }
    }
  }
}
