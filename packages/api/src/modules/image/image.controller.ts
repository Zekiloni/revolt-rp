import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { buildHref } from '../../util/response.util';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const uploadsDir = path.resolve(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post('', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  return res.status(201).json({ url: buildHref(req, `/uploads/${req.file.filename}`) });
});

export default router;
