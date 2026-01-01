import express from 'express';
import upload from '../../middlewares/upload';
import { FileController } from './file.controller';

const router = express.Router();

router.post('/', upload.single('file'), FileController.upload);

export default router;
