import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'defalut';
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 10);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const CALLBACK_CLIENT_URL = process.env.CALLBACK_CLIENT_URL;

export {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  CALLBACK_CLIENT_URL,
  JWT_REFRESH_SECRET,
  SALT_ROUNDS,
};
