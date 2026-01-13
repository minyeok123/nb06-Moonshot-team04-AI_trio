import { BASE_URL } from '@libs/constants';

export class FileService {
  createFileUrl = (file: string | Express.Multer.File) => {
    if (typeof file === 'string') {
      return file.startsWith('http') ? file : `${BASE_URL}${file}`;
    }

    return `${BASE_URL}/uploads/${file.filename}`;
  };
}
