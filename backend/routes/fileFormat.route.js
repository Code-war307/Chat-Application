import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { fileConvertController } from '../controllers/fileConvert.controller.js';
const router = express.Router()

router.post('/convert', protectedRoute, upload.single('file'), fileConvertController)

export default router;