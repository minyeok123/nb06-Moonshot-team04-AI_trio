import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../libs/error';

export async function verifyState(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.session.oauthState !== req.query.state)
      throw new CustomError(404, '부적절한 접근이 감지되었습니다');
    delete req.session.oauthState;
    next();
  } catch (e) {
    next(e);
  }
}
