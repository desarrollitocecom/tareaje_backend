const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Rutas para guardar las fotos y las justificaciones
const { FOTOS_RUTA, PDF_RUTA } = process.env;

// Función para asegurarse de que las carpetas existen
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Asegurarse de que las rutas existen
ensureDirectoryExists(FOTOS_RUTA);
ensureDirectoryExists(PDF_RUTA);

// Configuración de almacenamiento para fotos
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FOTOS_RUTA);
    },
    filename: (req, file, cb) => {
        const uniqueName = file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    },
});

// Configuración de almacenamiento para PDFs
const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PDF_RUTA);
    },
    filename: (req, file, cb) => {
        const uniqueName = file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    },
});

// Middleware para manejar la subida de una foto
const saveImage = multer({
    storage: imageStorage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Formato no permitido. Solo se aceptan imágenes en formato JPEG o PNG.'));
        }
        cb(null, true);
    },
}).single('photo');

// Middleware para manejar la subida de hasta 5 PDFs :
const savePdf = multer({
    storage: pdfStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Formato no permitido. Solo se aceptan archivos PDF.'));
        }
        cb(null, true);
    },
}).array('documents', 5);

// Middleware para manejar errores de Multer
const multerError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Error de carga de archivos: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ message: `Error: ${err.message}` });
    }
    next();
};

module.exports = {
    saveImage,
    savePdf,
    multerError,
};
