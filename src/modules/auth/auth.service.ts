import { NextFunction, Request, Response } from 'express';
import { AuthRepo } from './auth.repo';

export class AuthService {
  constructor(private repo: AuthRepo) {}

  register = async (req: Request, res: Response, next: NextFunction) => {};
}
