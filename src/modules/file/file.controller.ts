import { Request, Response, NextFunction } from 'express';
import { FileService } from './file.service';

const fileService = new FileService();

export class FileController {
  static upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: '파일이 없습니다.' });
      }

      const fileUrl = fileService.createFileUrl(req.file);

      res.status(201).json({
        fileUrl,
      });
    } catch (error) {
      next(error);
    }
  };
}
