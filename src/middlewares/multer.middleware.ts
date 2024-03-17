import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadFolder = 'uploads/';

// Crear la carpeta 'uploads' si no existe
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
});

export default upload;
