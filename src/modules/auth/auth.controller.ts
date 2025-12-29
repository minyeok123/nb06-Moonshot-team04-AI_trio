import { NextFunction, Request, Response } from 'express';
import { AuthRepo } from './auth.repo';
import { AuthService } from './auth.service';

export class AuthController {
  static register = async (req: Request, res: Response, next: NextFunction) => {};
}

const authRepo = new AuthRepo();
const authService = new AuthService(authRepo);
