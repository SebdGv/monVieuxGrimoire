const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
// Configuration du stockage des fichiers avec Multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    const filename = name + Date.now() + "." + extension;
    console.log(`Saving file: ${filename}`); // verfication filename
    callback(null, filename);
  },
});

module.exports = multer({ storage: storage }).single("image");
