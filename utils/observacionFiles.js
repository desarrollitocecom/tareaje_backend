const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { FOTOS_OBSERVACION_RUTA } = process.env;

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FOTOS_OBSERVACION_RUTA);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${getFileExtension(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const saveImage = multer({
  storage: imageStorage,
  limits: { fileSize: Infinity }, // 100 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error(
        "Formato de archivo no permitido. Solo se aceptan imágenes en formato JPEG, JPG o PNG.",
      );
      error.code = "INVALID_FORMAT";
      return cb(error);
    }
    cb(null, true);
  },
}).single("photo");

function getFileExtension(filename) {
  const ext = filename.substring(filename.lastIndexOf("."));
  return ext ? ext.toLowerCase() : "";
}

const multerError = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.code === "INVALID_FORMAT") {
    console.log(err);
    const errores = [];
    switch (err.code) {
      case "INVALID_FORMAT":
        errores.push(err.message);
        break;
      case "LIMIT_FILE_SIZE":
        errores.push(
          `El archivo excede el tamaño permitido. Máximo permitido: ${err.field === "photo" ? "50 MB" : "150 MB"}`,
        );
        break;
      case "LIMIT_FILE_COUNT":
        errores.push(
          "Se ha excedido el límite de archivos permitidos. Máximo permitido: 30 PDFs.",
        );
        break;
      default:
        errores.push("Ocurrió un error con la carga de archivos.");
        break;
    }

    return res.status(400).json({
      message: "Se encontraron los siguientes errores...",
      data: errores,
    });
  } else if (err) {
    return res.status(400).json({
      message: "Error inesperado",
      data: [err.message],
    });
  }
  next();
};

const deletePhoto = (file) => {
  const filePath = path.join(FOTOS_OBSERVACION_RUTA, file);
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlink(absolutePath, (err) => {
        if (err)
          return reject(
            new Error(`Error al eliminar el archivo: ${err.message}`),
          );
        resolve(`Archivo eliminado correctamente: ${absolutePath}`);
      });
    } else resolve(`Archivo no encontrado: ${absolutePath}`);
  });
};

module.exports = {
  saveImage,
  multerError,
  deletePhoto,
};
