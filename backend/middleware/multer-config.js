const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    const filename = name + Date.now() + "." + extension;
    console.log(`Saving file: ${filename}`); // Ajoutez ce log pour vérifier le nom du fichier
    callback(null, filename);
  },
});

const upload = multer({ storage: storage }).single("image");

const uploadAndOptimizeImage = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return next();
    }

    const filename = req.file.filename;
    const filePath = `images/${filename}`;

    try {
      await sharp(filePath)
        .resize(800) // Redimensionner l'image à 800px de largeur, ajustez selon vos besoins
        .webp({ quality: 80 }) // Convertir en WebP avec une qualité de 80, ajustez selon vos besoins
        .toFile(`images/optimized-${filename}`);

      fs.unlink(filePath, (err) => {
        // NE FONCTIONNE PAAAAAAS
        if (err) console.error("Error deleting original image:", err);
      });

      req.file.filename = `optimized-${filename}`;
      next();
    } catch (error) {
      console.error("Error optimizing image:", error);
      next(error);
    }
  });
};

module.exports = uploadAndOptimizeImage;
