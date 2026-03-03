// middleware/multer.js
import multer from "multer";

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  // Autoriser les images et les PDF uniquement
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
