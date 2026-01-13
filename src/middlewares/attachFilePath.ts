import { Request, Response, NextFunction } from 'express';

export function attachFilePath(req: Request, _res: Response, next: NextFunction) {
  if (req.file) {
    req.body.file = `/uploads/${req.file.filename}`;
  }

  if (Array.isArray(req.files)) {
    req.body.files = req.files.map((file) => `/uploads/${file.filename}`);
  }

  next();
}
