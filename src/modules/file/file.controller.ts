import { Request, Response, NextFunction } from 'express';
import { FileService } from './file.service';
import { CustomError } from '../../libs/error';

const fileService = new FileService();

export class FileController {
  static upload = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new CustomError(400, '파일이 존재하지 않습니다');
    }

    const imgUrl = fileService.createFileUrl(req.file);

    res.status(201).json([imgUrl]);
  };
}
