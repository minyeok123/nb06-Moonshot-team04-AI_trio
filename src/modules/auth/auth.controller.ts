import { NextFunction, Request, Response } from 'express';
import { AuthRepo } from './auth.repo';
import { AuthService } from './auth.service';

export class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await AuthService.login(email, password);

    res.status(200).json({ message: 'login Ok!', accessToken, refreshToken });
  };
}

const authRepo = new AuthRepo();
const authService = new AuthService(authRepo);
