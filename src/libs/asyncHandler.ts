import { Request, Response, NextFunction, RequestHandler } from 'express';

export default function asyncHandler(handler: RequestHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
