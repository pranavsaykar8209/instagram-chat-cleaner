export const SELECTORS = {
  // Indicator that the user is logged in
  HOME_INDICATOR: 'svg[aria-label="Home"]',
  
  // Indicator that the user is logged out and on the login page
  LOGIN_USERNAME_INPUT: 'input[name="username"]',
  
  // Cookie consent buttons
  COOKIE_ALLOW_BUTTON: 'button:has-text("Allow all cookies")',
  COOKIE_DECLINE_BUTTON: 'button:has-text("Decline optional cookies")',

  // Chat Inspector Selectors
  CHAT_ROW_ROLE: 'row',
  MESSAGE_OPTIONS_BUTTON: '[aria-label="See more options for message"]',
  MESSAGE_IMAGE_TAG: 'img',
  MESSAGE_VIDEO_TAG: 'video',
  MESSAGE_AUDIO_TAG: 'audio',
  PLAY_BUTTON_NAME: /play/i,
  VIEW_POST_LINK_NAME: /view post/i,

  // Unsend Locators
  UNSEND_MENU_ITEM: /Unsend/i,
  UNSEND_CONFIRM_DIALOG_BUTTON: /Unsend/i,
};
