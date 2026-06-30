# Instagram Chat Cleaner

An automated Node.js tool built with Playwright to bulk unsend your Instagram direct messages safely and efficiently.

## Features

- **Automated Login & Session Persistence**: Logs into your Instagram account and saves the authentication session so you don't have to repeatedly enter credentials or deal with 2FA on every run.
- **Smart Message Detection**: Reliably detects messages sent exclusively by you by inspecting Instagram's nested flexbox DOM structures.
- **Media Support**: Safely unsends text messages, voice notes, images, videos, shared posts, and Instagram Reels.
- **Robust UI Handling**: Automatically manages and dismisses Instagram's fullscreen video modals and dialog popups if they accidentally trigger.
- **Auto-Scrolling**: Automatically scrolls up to load older message history once the visible ones are cleared.
- **Configurable Limits**: Limit the number of messages to delete per run to avoid temporary action blocks.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- An active Instagram account

## Installation

1. Clone or download this repository.
2. Install the required dependencies in your terminal:
   ```bash
   npm install
   ```

## Configuration

You can configure the bot's behavior in `src/config/constants.js`.

```javascript
// Configuration for the cleaner
// Set to a number (e.g. 50) to limit the number of messages to unsend.
// Set to null or undefined to unsend ALL messages in the chat.
export const MAX_MESSAGES_TO_UNSEND = 50;
```

## Usage

1. Start the bot:
   ```bash
   npm start
   ```

2. **First Run (Authentication)**: 
   - A visible Chromium browser will open.
   - The bot will navigate to the Instagram login page and pause.
   - Manually log into your account, complete any 2FA verification, and wait until your home feed fully loads.
   - The bot will detect the successful login, save your session to `playwright/.auth/user.json`, and close.

3. **Subsequent Runs (Cleaning)**:
   - Run `npm start` again. It will automatically log you in using the saved session.
   - Navigate to the specific Direct Message chat you want to clean up.
   - Leave the browser window alone for a few seconds. The bot will automatically map the chat, target your sent messages, and begin unsending them one by one.
   - When the configured limit is reached or the chat is cleared, the script will finish.

## Important Notes & Warnings

- **Take a Backup**: Unsending messages is **permanent** and cannot be undone. It is highly recommended that you take a backup of your chats before running this tool. [Click here to learn how to export your Instagram chats](https://www.google.com/search?q=how+to+export+chats+in+instagram).
- **Privacy & Security**: Your Instagram session is saved locally in the `playwright/.auth/` directory. This folder is explicitly ignored in the `.gitignore` file, guaranteeing that your sensitive authentication data will never be committed or pushed to Git/GitHub.
- **Browser Visibility**: Keep the browser window visible on your screen while the bot is actively running. Minimizing the window might cause Playwright to suspend animations, which can break the interaction flow.
- **Anti-Bot Measures & Rate Limits**: The bot is programmed to delete your messages in extremely fast rapid-fire batches of 10. To prevent Instagram from flagging your account for spam, it automatically injects a **randomized human-like jitter** (2-4 seconds) after every 10th message, and takes a 15-second cooldown break every 50 messages. Even with these protections, unsending hundreds of messages at once may still trigger a temporary block from Instagram. It is highly recommended to use the `MAX_MESSAGES_TO_UNSEND` limit and run the script in batches.

## License
MIT
