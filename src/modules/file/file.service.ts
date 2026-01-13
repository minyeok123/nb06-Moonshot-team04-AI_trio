import { BASE_URL } from '@libs/constants';

export class FileService {
  createFileUrl = (file: Express.Multer.File) => {
    if (file) {
      const imgUrl = `${BASE_URL}/uploads/${file.filename}`;
      return imgUrl;
    }

    // if (Array.isArray(file)) {
    //   const imgUrls = file.map((f: any) => `/uploads/${f.filename}`);
    //   return imgUrls;
    // }
  };
}
