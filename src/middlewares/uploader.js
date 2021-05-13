const multer = require('multer');
const path = require('path');

//const maxSize = 10 * 1024 * 1024;

const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, path.join(__dirname, '../../uploads'));
    }
  }),
  fileFilter: (req, file, done) => {
    if (
      [
        'image/gif',
        'image/png',
        'image/jpeg',
        'image/bmp',
        'image/webp'
      ].includes(file.mimetype)
    ) {
      done(null, true);
    } else {
      const error = new Error('Invalid file type');
      done(error, false);
    }
  }
  //limits: { fileSize: maxSize }
});

module.exports = uploader;
