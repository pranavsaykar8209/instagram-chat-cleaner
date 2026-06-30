import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const INSTAGRAM_URL = 'https://www.instagram.com/';
export const SESSION_PATH = path.resolve(__dirname, '../../playwright/.auth/user.json');

// Configuration for the cleaner
// Set to a number (e.g. 5) to limit the number of messages to unsend.
// Set to null or undefined to unsend ALL messages in the chat.
export const MAX_MESSAGES_TO_UNSEND = 50;
