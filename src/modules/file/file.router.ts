import express from 'express';
import upload from '../../middlewares/upload';
import { FileController } from './file.controller';

const router = express.Router();

router.post('/', upload.single('files'), FileController.upload);

export default router;
