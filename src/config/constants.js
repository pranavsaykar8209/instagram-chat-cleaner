import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const INSTAGRAM_URL = 'https://www.instagram.com/';
export const SESSION_PATH = path.resolve(__dirname, '../../playwright/.auth/user.json');
