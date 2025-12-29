import { AuthRepo } from './auth.repo';

import bcrypt from 'bcrypt';
import token from './utils/token';

export class AuthService {
  constructor(private repo: AuthRepo) {}

  static login = async (email: string, password: string) => {
    const getUser = await AuthRepo.findUserByEmail(email);
    if (!getUser) throw new Error('사용자 아이디를 찾을 수 없습니다');

    const userPassword = getUser.password as string;
    const isPasswordValid = await bcrypt.compare(password, userPassword);

    if (!isPasswordValid) throw new Error('비밀번호를 확인 해 주세요');

    const { accessToken, refreshToken } = token.createTokens(getUser.id);

    return { accessToken, refreshToken };
  };
}
