import { Request, Response, NextFunction } from 'express';
import { FileService } from './file.service';

const fileService = new FileService();

export class FileController {
  static upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: '파일이 없습니다.' });
      }

      // console.log(req.file.path);

      res.status(201).json({
        profileImage: req.file.path,
      });
    } catch (error) {
      next(error);
    }
  };
}
