import crypto from 'crypto';

export function generateState(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}
