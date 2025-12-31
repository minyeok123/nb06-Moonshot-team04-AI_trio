import express from 'express';
import upload from '../../middlewares/upload';

const router = express.Router();

router.post('/', upload.single('file'));

export default router;
