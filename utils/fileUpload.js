const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = (folderName, allowedMimeTypes) =>
  multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (_, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"));
      }
      const uniqueFileName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueFileName);
    },
  });

const fileUpload = (folderName, allowedMimeTypes) =>
  multer({
    storage: storage(folderName, allowedMimeTypes),
    fileFilter: (_, file, cb) => {
      const allowed = allowedMimeTypes.some((type) => type === file.mimetype);
      if (allowed) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"));
      }
    },
  });

module.exports = fileUpload;
