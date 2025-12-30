import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../../../libs/constants';
import { prisma } from '../../../libs/prisma';
import { TokenExpiredError } from '../../../libs/error';
import bcrypt from 'bcrypt';

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

    const refreshToken = jwt.sign(payload, JWT_SECRET!, refreshExpiresIn);

    return { accessToken, refreshToken };
  };

  verifyAccessToken = (token: string) => {
    const decodedUser = jwt.verify(token, JWT_SECRET!) as tokenPayloadUserid;

    return { userId: decodedUser.id };
  };

  refresh = async (
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> => {
    let payload;

    payload = jwt.verify(refreshToken, JWT_SECRET!) as JwtPayload;
    if (!payload) throw new TokenExpiredError();
    const { id } = payload;

    const refreshInfo = await prisma.refreshToken.findFirst({ where: { userId: Number(id) } });
    if (!refreshInfo) throw new TokenExpiredError();
    const isValid = await bcrypt.compare(refreshToken, refreshInfo.token);
    if (!isValid) throw new TokenExpiredError();

    const tokens = this.createTokens(id);
    const { accessToken, refreshToken: newRefreshToken } = tokens;

    const { exp } = jwt.verify(newRefreshToken, JWT_SECRET!) as JwtPayload;
    const expiresAt = new Date(exp! * 1000);

    const nowDate = new Date();
    if (refreshInfo.expiresAt < nowDate) throw new TokenExpiredError();
    const hashNewRedfreshToken = await this.hashRefreshToken(newRefreshToken);

    await prisma.refreshToken.update({
      where: { id: refreshInfo.id },
      data: {
        token: hashNewRedfreshToken,
        expiresAt: expiresAt,
      },
    });
    return { accessToken, newRefreshToken };
  };

  hashRefreshToken = async (refreshToken: string) => {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(refreshToken, saltRounds);
    return hashed;
  };
}

export default new Token();
