import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../../libs/constants';

export async function hashData(data: string) {
  return await bcrypt.hash(data, SALT_ROUNDS!);
}

export async function compareData(data: string, hashedData: string) {
  return bcrypt.compare(data, hashedData);
}
