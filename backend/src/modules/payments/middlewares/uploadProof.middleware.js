import multer from 'multer';

const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (_req, file, cb) => {
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

export const uploadProof = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
