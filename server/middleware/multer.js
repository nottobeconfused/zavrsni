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

const fileFilter = (req, file, cb) =>{
     if(
          file.mimetype === "image/jpeg" ||
          file.mimetype === "image/png" ||
          file.mimetype === "application/pdf" 
     ){
          cb(null, true);
     } else {
          cb(null, false);
     }
};

const upload = multer({
     storage: storage,
     limits: {
          fileSize: 1024 * 1024 * 5,
     },
     fileFilter: fileFilter,
});

module.exports = upload;