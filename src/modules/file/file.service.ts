import { Express } from 'express';

export class FileService {
  createFileUrl = (file: Express.Multer.File) => {
    return `/uploads/${file.filename}`;
  };
}
