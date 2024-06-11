const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filename = req.file.filename;
  const filePath = path.join(__dirname, "../images", filename);
  const optimizedFilename = `optimized-${filename}`;
  const optimizedFilePath = path.join(
    __dirname,
    "../images",
    optimizedFilename
  );

  try {
    // LIRE LE FICHIER DANS UN BUFFER
    const fileBuffer = await fs.promises.readFile(filePath);

    // CONVERTIR L'IMAGE À PARTIR DU BUFFER
    await sharp(fileBuffer)
      .resize(600)
      .webp({ quality: 40 })
      .toFile(optimizedFilePath);

    // SUPPRIMER LE FICHIER ORIGINAL APRÈS AVOIR CRÉÉ LE FICHIER OPTIMISÉ
    await fs.promises.unlink(filePath);

    // METTRE À JOUR LE NOM DU FICHIER DANS REQ.FILE
    req.file.filename = optimizedFilename;
    next();
  } catch (error) {
    console.error("Error optimizing image:", error);
    next(error);
  }
};

module.exports = optimizeImage;
