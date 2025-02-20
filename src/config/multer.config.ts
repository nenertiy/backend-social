import { Options as MulterOptions, MulterError } from 'multer';

export const multerOptions: MulterOptions = {
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'file'));
    }
    cb(null, true);
  },
};
