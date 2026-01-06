import jwt from 'jsonwebtoken';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../../../libs/constants';
import { CustomError } from '../../../libs/error';

interface tokenPayloadUserid {
  id: number;
}

interface RefreshTokenPayload extends tokenPayloadUserid {
  exp: number;
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
    return jwt.verify(token, JWT_REFRESH_SECRET!) as RefreshTokenPayload;
  };

  decodeToken = (token: string) => {
    const decoded = jwt.decode(token) as { [key: string]: any } | null;
    if (!decoded) throw new CustomError(404, '유효하지 않은 토큰 입니다');
    return decoded;
  };
}

export default new Token();
