import { AuthRepo } from './auth.repo';
import bcrypt from 'bcrypt';
import type { User } from '../../types/user';
import { BadRequestError } from './utils/customError';
import token from './utils/token';

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
      throw new BadRequestError(401, '이미 가입된 이메일 입니다.');
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
    if (!getUser) throw new Error('사용자 아이디를 찾을 수 없습니다');

    const userPassword = getUser.password as string;
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) throw new Error('비밀번호를 확인 해 주세요');

    const { accessToken, refreshToken } = token.createTokens(getUser.id);
    await this.repo.login(refreshToken, getUser.id);

    return { accessToken, refreshToken };
  };
}
