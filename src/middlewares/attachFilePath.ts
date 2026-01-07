import { Request, Response, NextFunction } from 'express';

export function attachFilePath(req: Request, _res: Response, next: NextFunction) {
  if (req.file) {
    req.body.file = `/uploads/${req.file.filename}`;
  }

  next();
}
