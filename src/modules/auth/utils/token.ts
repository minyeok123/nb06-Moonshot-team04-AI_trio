import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../../../libs/constants';

interface tokenPayloadUserid {
  id: number;
}

class Token {
  createTokens = (userId: number) => {
    const payload = { id: userId };
    const accessExpiresIn: object = { expiresIn: '1h' };
    const refreshExpiresIn: object = { expiresIn: '7d' };
    // access,refresh 유지 시간 정리 필요

    const accessToken = jwt.sign(payload, JWT_SECRET!, accessExpiresIn);

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET!, refreshExpiresIn);

    return { accessToken, refreshToken };
  };

  verifyAccessToken = (token: string) => {
    const decodedUser = jwt.verify(token, JWT_SECRET!) as tokenPayloadUserid;

    return { userId: decodedUser.id };
  };

  verifyRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET!) as JwtPayload;
  };
}

export default new Token();
