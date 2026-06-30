import { SELECTORS } from '../selectors/instagram.js';

export async function runInspector(page) {
  console.log('\n========================================');
  console.log('Proceeding to Step 5: Inspector.');
  console.log('========================================\n');
  
  console.log('[Inspector] Starting Message Inspector...');
  console.log('[Inspector] Please navigate to a chat manually in the browser window.');

  await page.waitForURL('**/direct/t/**', { timeout: 0 });
  
  console.log('[Inspector] Chat detected. Scanning the DOM automatically...');
  await page.waitForTimeout(3000);

  const mainFeed = page.getByRole('main');
  await mainFeed.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  
  // Thanks to the diagnostic tree, we know exactly what a message is!
  // It is always wrapped in a `<div role="group">` at Level 8.
  const messageGroups = await mainFeed.getByRole('group').all();
  
  console.log(`[Inspector] Found ${messageGroups.length} total groups (rows) in the chat feed!`);
  
  let validMessageCount = 0;

  for (let i = 0; i < messageGroups.length; i++) {
    const group = messageGroups[i];
    
    // To trigger the options button, we can't just click the empty space of the row.
    // We must click the actual content bubble inside the row.
    const contentBubble = group.locator('div[dir="auto"], img, video, audio').first();
    
    if (await contentBubble.isVisible().catch(() => false)) {
      await contentBubble.click({ force: true }).catch(() => {});
      await contentBubble.hover({ force: true }).catch(() => {});
      await page.waitForTimeout(150);
    }

    // Since we now check ALL elements inside the group (instead of just 4 levels),
    // it will perfectly detect the flex-end and row-reverse styles you saw at Level 5 and 6!
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

    const isOptionsBtnVisible = await page.getByRole('button', { name: 'See more options for message' }).first().isVisible().catch(() => false);
    
    let type = 'unknown';
    const textContent = await group.textContent() || '';
    
    const hasImage = await group.locator('img').count() > 0;
    const hasVideo = await group.locator('video').count() > 0;
    const hasVoice = await group.locator('audio').count() > 0 || await group.locator('button', { hasText: /play/i }).count() > 0;
    const hasSharedPost = await group.locator('a', { hasText: /view post/i }).count() > 0;

    if (hasSharedPost) type = 'shared post';
    else if (hasVoice) type = 'voice';
    else if (hasVideo) type = 'reel/video';
    else if (hasImage) type = 'image';
    else if (textContent.trim().length > 0) type = 'text';
    
    // Skip empty timestamps or non-messages
    if (type === 'unknown' && textContent.trim().length === 0 && !hasImage && !hasVideo) {
      continue; 
    }
    
    validMessageCount++;
    const previewText = textContent.replace(/\s+/g, ' ').trim();
    console.log(`[Message ${validMessageCount}]`);
    console.log(`  - Sent by me: ${isSentByMe ? 'Yes' : 'No'}`);
    console.log(`  - Type: ${type}`);
    console.log(`  - Options Button Visible: ${isOptionsBtnVisible ? 'Yes' : 'No'}`);
    console.log(`  - Text Preview: "${previewText.substring(0, 50)}${previewText.length > 50 ? '...' : ''}"`);
    console.log(''); 
  }
  
  console.log('[Inspector] Inspection complete.');
}
