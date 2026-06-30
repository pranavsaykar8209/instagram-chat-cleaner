import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Core configuration constants
export const INSTAGRAM_URL = 'https://www.instagram.com/';

// Path to save the Playwright authenticated session
export const SESSION_PATH = path.resolve(__dirname, '../../playwright/.auth/session.json');
