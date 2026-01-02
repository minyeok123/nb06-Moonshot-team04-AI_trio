import { AuthRepo } from './auth.repo';
import bcrypt from 'bcrypt';
import type { User } from '../../types/user';
import token from './utils/token';
import { CustomError } from '../../libs/error';
import { compareData, hashData } from './utils/hash';

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
    const response: ResponseUser = {
      id: userWithoutPassword['id'],
      email: userWithoutPassword['email'],
      name: userWithoutPassword['name'],
      profileImage: userWithoutPassword['profileImgUrl'],
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
}
