import axios from 'axios';
import { prisma } from '@libs/prisma';
import { CustomError } from '@libs/error';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@libs/constants';
import { decryptToken } from '@modules/auth/utils/crypt';

export const getGoogleAccessTokenFromRefresh = async (userId: number) => {
  const getDbToken = await getGoogleRefreshToken(userId);
  if (!getDbToken) throw new CustomError(404, '데이터 조회 실패');
  const decryptedToken = decryptToken(getDbToken.refreshToken);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    client_secret: GOOGLE_CLIENT_SECRET!,
    refresh_token: decryptedToken,
    grant_type: 'refresh_token',
  });
  const res = await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data.access_token;
};

const getGoogleRefreshToken = async (userId: number) => {
  return await prisma.oauth.findFirst({ where: { userId, provider: 'google' } });
};
