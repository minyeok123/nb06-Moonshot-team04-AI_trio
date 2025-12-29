import { NextFunction, Request, Response } from 'express';
import { AuthRepo } from './auth.repo';
import { AuthService } from './auth.service';
import token from '../auth/utils/token';
import { TokenExpiredError } from '../../libs/error';

export class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await AuthService.login(email, password);

    res.status(200).json({ message: 'login Ok!', accessToken, refreshToken });
  };

  static refresh = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new TokenExpiredError();
    }
    const refreshToken = authHeader.split(' ')[1];

    const tokens = await token.refresh(refreshToken);
    const { accessToken, newRefreshToken } = tokens;
    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  };
}

const authRepo = new AuthRepo();
const authService = new AuthService(authRepo);
