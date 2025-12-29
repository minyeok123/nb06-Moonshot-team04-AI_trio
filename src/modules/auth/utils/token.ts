import jwt, { JwtPayload } from 'jsonwebtoken';
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

  refresh = async (
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> => {
    let payload;

    payload = jwt.verify(refreshToken, JWT_SECRET!) as JwtPayload;

    const { id } = payload;
    const tokens = this.createTokens(id);
    const { accessToken, refreshToken: newRefreshToken } = tokens;

    return { accessToken, newRefreshToken };
  };
}

export default new Token();
