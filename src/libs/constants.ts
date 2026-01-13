import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT);
const DATABASE_URL = process.env.DATABASE_URL;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default';
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 10);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3004/auth/google/callback';
const RESPONSE_TYPE = process.env.RESPONSE_TYPE || 'code';
const STATE_KEY = process.env.STATE_KEY || 'STATE_KEY';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const SESSION_SECRET = process.env.SESSION_SECRET || 'keyboard cat';
const CRYPTO_SECRET_KEY =
  process.env.TOKEN_SECRET_KEY ||
  'c7b6f1a0e8e9d6c2a1d34f6b87a9e92d9f34f1a8e71b0b8c8e2a1a9e4d2f6c3b';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3005';

export {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_REFRESH_SECRET,
  SALT_ROUNDS,
  RESPONSE_TYPE,
  STATE_KEY,
  SESSION_SECRET,
  CRYPTO_SECRET_KEY,
  FRONTEND_URL,
  BASE_URL,
};
