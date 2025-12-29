import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../libs/constants';

class Token {
  createTokens = (userId: number) => {
    const payload = { id: userId };
    const accessExpiresIn: object = { expiresIn: '1h' };
    const refreshExpiresIn: object = { expiresIn: '7d' };
    // access,refresh 유지 시간 정리 필요

    const accessToken = jwt.sign(payload, JWT_SECRET!, accessExpiresIn);
    const refreshToken = jwt.sign(payload, JWT_SECRET!, refreshExpiresIn);

    return { accessToken, refreshToken };
  };
}

export default new Token();
