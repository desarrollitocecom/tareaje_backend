const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Rutas para guardar las fotos y las justificaciones :
const { FOTOS_RUTA, PDF_RUTA, DNI_RUTA, CV_RUTA } = process.env;

// Configuración de almacenamiento para fotos :
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FOTOS_RUTA);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${getFileExtension(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// Configuración de almacenamiento para PDFs :
const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PDF_RUTA);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${getFileExtension(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// Función para obtener la extensión del archivo :
function getFileExtension(filename) {
    const ext = filename.substring(filename.lastIndexOf('.'));
    return ext ? ext.toLowerCase() : '';
}

// Middleware para manejar la subida de una foto :
const saveImage = multer({
    storage: imageStorage,
    limits: { fileSize: Infinity }, // 100 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('Formato de archivo no permitido. Solo se aceptan imágenes en formato JPEG, JPG o PNG.');
            error.code = 'INVALID_FORMAT';
            return cb(error);
        }
        cb(null, true);
    },
}).single('photo');

// Middleware para manejar la subida de hasta 100 PDFs :
const savePdf = multer({
    storage: pdfStorage,
    limits: { fileSize: 150 * 1024 * 1024 }, // 150 MB por cada PDF
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            const error = new Error('Formato de archivo no permitido. Solo se aceptan archivos PDF.');
            error.code = 'INVALID_FORMAT';
            return cb(error);
        }
        cb(null, true);
    },
}).array('documents', 100);

// Middleware para manejar la subida de un solo PDF de hasta 250 MB :
const uploadCv = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, CV_RUTA);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
        },
    }),
    limits: {
        fileSize: 250 * 1024 * 1024, // Tamaño máximo a 250MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            const error = new Error('Formato de documento no permitido. Solo PDFs.');
            error.code = 'INVALID_FORMAT';
            return cb(error);
        }
        cb(null, true);
    },
}).single('document');

// Middleware para manejar la subida de una imagen y un PDF :
const uploadImageAndPdf = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'photo') {
                cb(null, FOTOS_RUTA);
            } else if (file.fieldname === 'document') {
                cb(null, DNI_RUTA);
            }
        },
        filename: (req, file, cb) => {
            const uniqueName = `${uuidv4()}${getFileExtension(file.originalname)}`;
            cb(null, uniqueName);
        },
    }),
    limits: {
        fileSize: 250 * 1024 * 1024, // 250 MB de espacio
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'photo') {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.mimetype)) {
                const error = new Error('Formato de imagen no permitido. Solo JPEG, JPG o PNG.');
                error.code = 'INVALID_FORMAT';
                return cb(error);
            }
        } else if (file.fieldname === 'document') {
            if (file.mimetype !== 'application/pdf') {
                const error = new Error('Formato de documento no permitido. Solo PDFs.');
                error.code = 'INVALID_FORMAT';
                return cb(error);
            }
        }
        cb(null, true);
    },
}).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'document', maxCount: 1 },
]);

// Middleware para manejar errores de Multer :
const multerError = (err, req, res, next) => {
    
    if (err instanceof multer.MulterError || err.code === 'INVALID_FORMAT') {
        const errores = [];
        switch (err.code) {
            case 'INVALID_FORMAT':
                errores.push(err.message);
                break;
            case 'LIMIT_FILE_SIZE':
                errores.push(`El archivo excede el tamaño permitido. Máximo permitido: ${err.field === 'photo' ? '50 MB' : '150 MB'}`);
                break;
            case 'LIMIT_FILE_COUNT':
                errores.push('Se ha excedido el límite de archivos permitidos. Máximo permitido: 30 PDFs.');
                break;
            default:
                errores.push('Ocurrió un error con la carga de archivos.');
                break;
        }

        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });

    } else if (err) {
        return res.status(400).json({
            message: 'Error inesperado',
            data: [err.message],
        });
    }
    next();
};

// Función para eliminar archivos :
const deleteFile = (file) => {
    const filePath = path.join(PDF_RUTA, file);
    return new Promise((resolve, reject) => {
        const absolutePath = path.resolve(filePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlink(absolutePath, (err) => {
                if (err) return reject(new Error(`Error al eliminar el archivo: ${err.message}`));
                resolve(`Archivo eliminado correctamente: ${absolutePath}`);
            });
        } else resolve(`Archivo no encontrado: ${absolutePath}`);
    });
};

// Función para eliminar pdfs de DNI :
const deletePdfDNI = (file) => {
    const filePath = path.join(DNI_RUTA, file);
    return new Promise((resolve, reject) => {
        const absolutePath = path.resolve(filePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlink(absolutePath, (err) => {
                if (err) return reject(new Error(`Error al eliminar el archivo: ${err.message}`));
                resolve(`Archivo eliminado correctamente: ${absolutePath}`);
            });
        } else resolve(`Archivo no encontrado: ${absolutePath}`);
    });
};

// Función para eliminar fotos :
const deletePhoto = (file) => {
    const filePath = path.join(FOTOS_RUTA, file);
    return new Promise((resolve, reject) => {
        const absolutePath = path.resolve(filePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlink(absolutePath, (err) => {
                if (err) return reject(new Error(`Error al eliminar el archivo: ${err.message}`));
                resolve(`Archivo eliminado correctamente: ${absolutePath}`);
            });
        } else resolve(`Archivo no encontrado: ${absolutePath}`);
    });
};

// Función para eliminar CVs :
const deleteCv = (file) => {
    const filePath = path.join(CV_RUTA, file);
    return new Promise((resolve, reject) => {
        const absolutePath = path.resolve(filePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlink(absolutePath, (err) => {
                if (err) return reject(new Error(`Error al eliminar el archivo: ${err.message}`));
                resolve(`Archivo eliminado correctamente: ${absolutePath}`);
            });
        } else resolve(`Archivo no encontrado: ${absolutePath}`);
    });
};

module.exports = {
    saveImage,
    savePdf,
    uploadImageAndPdf,
    uploadCv,
    multerError,
    deleteFile,
    deletePdfDNI,
    deletePhoto,
    deleteCv
};
