import { AuthRepo } from './auth.repo';
import bcrypt from 'bcrypt';
import type { User } from '../../types/user';
import token from './utils/token';
import { CustomError } from '../../libs/error';
import { compareData, hashData } from './utils/hash';
import { BASE_URL } from '../../libs/constants';
import { googleOAuthAdapter } from './adapters/googleOAuth.adapter';
import { encryptToken } from './utils/crypt';

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
    const hashedrefreshToken = await hashData(refreshToken);
    const _ = await this.repo.saveRefresh(hashedrefreshToken, id, expiresAt);
    return { accessToken, refreshToken };
  };

  refresh = async (userId: number) => {
    const { accessToken, refreshToken } = token.createTokens(userId);
    const { id, exp } = token.verifyRefreshToken(refreshToken);
    const expiresAt = new Date(exp! * 1000);
    const hashedrefreshToken = await hashData(refreshToken);
    const _ = await this.repo.saveRefresh(hashedrefreshToken, id, expiresAt);
    return { accessToken, refreshToken };
  };

  googleLogin = async (state: string) => {
    return googleOAuthAdapter.getLoginUrl(state);
  };

  googleLoginByGoogleInfo = async (code: string) => {
    const { refresh_token, id_token, expires_in } = await googleOAuthAdapter.exchangeCodeForToken(
      code,
    );
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
      const hashedrefreshToken = await hashData(refreshToken);
      const _ = await this.repo.saveRefresh(hashedrefreshToken, id, refreshTokenExpiresAt);
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
      const hashedrefreshToken = await hashData(refreshToken);
      const _ = await this.repo.saveRefresh(hashedrefreshToken, id, refreshTokenExpiresAt);
      return { accessToken, refreshToken };
    }
  };
}
