const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, "uploads/");
     },
     filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = path.basename(file.originalname, ext);
          cb(null, filename + "-" + uniqueSuffix + ext);
        },
});

const fileFilter = (req, file, cb) => {
     const allowedFileTypes = [
          'text/plain',
          'application/x-rar-compressed',
          'application/zip',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/html',
          'text/css',
          'image/jpeg',
          'image/png',
          'application/pdf'
        ];
   
     if (allowedFileTypes.includes(file.mimetype)) {
       cb(null, true);
     } else {
       cb(null, false);
     }
   };

const upload = multer({
     storage: storage,
     limits: {
          fileSize: 1024 * 1024 * 50,
     },
     fileFilter: fileFilter,
});

module.exports = upload;