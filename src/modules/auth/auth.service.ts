import axios from 'axios';
import bcrypt from 'bcrypt';
import { CustomError } from '@libs/error';
import type { User } from '@app-types/user';
import token from '@modules/auth/utils/token';
import { encryptToken } from '@modules/auth/utils/crypt';
import { AuthRepo } from '@modules/auth/auth.repo';
import { compareData, hashData } from '@modules/auth/utils/hash';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  RESPONSE_TYPE,
  BASE_URL,
} from '@libs/constants';

type RegisterData = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string };
type ResponseUser = Pick<User, 'id' | 'email' | 'name' | 'createdAt' | 'updatedAt'> & {
  profileImage: string | null;
};

export class AuthService {
  constructor(private repo: AuthRepo) {}

  register = async (data: RegisterData) => {
    const { password } = data;
    const existingUser = await this.repo.findOrUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new CustomError(401, '이미 가입한 이메일 입니다.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const dataToSave = {
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        profileImgUrl: data.profileImgUrl,
      },
    };

    const user = await this.repo.create(dataToSave);
    const { password: _, ...userWithoutPassword } = user;

    const baseUrl = BASE_URL;
    const response: ResponseUser = {
      id: userWithoutPassword['id'],
      email: userWithoutPassword['email'],
      name: userWithoutPassword['name'],
      profileImage: userWithoutPassword['profileImgUrl']
        ? `${baseUrl}${userWithoutPassword.profileImgUrl}`
        : null,
      createdAt: userWithoutPassword['createdAt'],
      updatedAt: userWithoutPassword['updatedAt'],
    };
    return response;
  };

  login = async (email: string, password: string) => {
    const getUser = await this.repo.findUserByEmail(email);
    if (!getUser) throw new CustomError(404, '존재하지 않거나 비밀번호가 일치하지 않습니다');

    const verifyPassword = await compareData(password, getUser.password!);
    if (!verifyPassword) throw new CustomError(404, '존재하지 않거나 비밀번호가 일치하지 않습니다');

    const { accessToken, refreshToken } = token.createTokens(getUser.id);
    const { id, exp } = token.verifyRefreshToken(refreshToken);
    const expiresAt = new Date(exp! * 1000);
    const hashedRefreshToken = await hashData(refreshToken);
    const _ = await this.repo.saveRefresh(hashedRefreshToken, id, expiresAt);
    return { accessToken, refreshToken };
  };

  refresh = async (userId: number) => {
    const { accessToken, refreshToken } = token.createTokens(userId);
    const { id, exp } = token.verifyRefreshToken(refreshToken);
    const expiresAt = new Date(exp! * 1000);
    const hashedRefreshToken = await hashData(refreshToken);
    const _ = await this.repo.saveRefresh(hashedRefreshToken, id, expiresAt);
    return { accessToken, refreshToken };
  };

  googleLogin = async (state: string) => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      redirect_uri: GOOGLE_REDIRECT_URI!,
      response_type: RESPONSE_TYPE!,
      scope: 'openid email profile https://www.googleapis.com/auth/calendar',
      state: state,
      access_type: 'offline',
      prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  googleLoginByGoogleInfo = async (code: string) => {
    const url = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      redirect_uri: GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    });
    const response = await axios.post(url, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { refresh_token, id_token, expires_in } = response.data;
    const encryptedRefresh = encryptToken(refresh_token);
    const { sub, email, name, picture } = token.decodeToken(id_token);
    const expiresAt = new Date(expires_in * 1000);
    const savedUser = await this.repo.findOAuthByEmail(email);
    const existingOAuth = savedUser?.oauths.find(
      (oauth) => oauth.providerId === sub && oauth.provider === 'google',
    );
    if (existingOAuth) {
      const updateOAuth = await this.repo.updateOAuth(encryptedRefresh, expiresAt, sub, 'google');

      if (!updateOAuth) throw new CustomError(404, '구글 로그인 실패');

      const { accessToken, refreshToken } = token.createTokens(updateOAuth.userId);
      const { id, exp } = token.verifyRefreshToken(refreshToken);
      const refreshTokenExpiresAt = new Date(exp! * 1000);
      const hashedRefreshToken = await hashData(refreshToken);
      const _ = await this.repo.saveRefresh(hashedRefreshToken, id, refreshTokenExpiresAt);
      return { accessToken, refreshToken };
    }

    if (!existingOAuth) {
      const createUser = await this.repo.createOAuth(
        email,
        name,
        picture,
        encryptedRefresh,
        expiresAt,
        sub,
        'google',
      );

      if (!createUser) throw new CustomError(404, '구글 로그인 실패');

      const { accessToken, refreshToken } = token.createTokens(createUser.id);
      const { id, exp } = token.verifyRefreshToken(refreshToken);
      const refreshTokenExpiresAt = new Date(exp! * 1000);
      const hashedRefreshToken = await hashData(refreshToken);
      const _ = await this.repo.saveRefresh(hashedRefreshToken, id, refreshTokenExpiresAt);
      return { accessToken, refreshToken };
    }
  };
}
