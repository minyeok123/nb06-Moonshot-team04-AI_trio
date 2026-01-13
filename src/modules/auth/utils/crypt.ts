import crypto from 'crypto';
import { CRYPTO_SECRET_KEY } from '@libs/constants';

const ALGO = 'aes-256-gcm';
const KEY = Buffer.from(CRYPTO_SECRET_KEY!, 'hex');
const IV_LENGTH = 12;

export function encryptToken(token: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptToken(data: string) {
  const [ivHex, authTagHex, encrypted] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
