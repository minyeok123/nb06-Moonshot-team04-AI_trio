import { NextFunction, Request, Response } from 'express';
import { AuthRepo } from './auth.repo';
import { AuthService } from './auth.service';

export class AuthController {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body, profileImgUrl: req.file?.path ?? null };
    const userWithoutPassword = await authService.register(data);
    res.status(201).send(userWithoutPassword);
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(email, password);
    res.status(200).json({ message: 'login Ok!', accessToken, refreshToken });
  };

  static refresh = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.refresh!.id;
    const token = await authService.refresh(userId);
    res.status(200).json(token);
  };
}

const authRepo = new AuthRepo();
const authService = new AuthService(authRepo);
