const {
    getAllHistorial,
    validateUsuarioHistorial,
    getUsuarioHistorial
} = require('../controllers/historialController');

const { createHistorial } = require('../controllers/historialController');

const getAllHistorialHandler = async (req,res) => {
    
    const { page = 1, limit = 20 } = req.query;
    const token = req.user;
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un número entero...');
    if (page <= 0) errores.push('El page debe ser mayor que cero...');
    if (isNaN(limit)) errores.push('El limit debe ser un número entero...');
    if (limit <= 0) errores.push('El limit debe ser mayor que cero...');
    if (errores.length > 0) return res.status(400).json({ errores });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllHistorial(numPage, numLimit);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) {
            return res.status(404).json({
                message: "Página fuera de rango...",
                data: {
                    historial: [],
                    currentPage: numPage,
                    pageCount: response.data.length,
                    totalCount: response.totalCount,
                    totalPages: totalPages,
                }
            });
        }

        const historial = await createHistorial(
            'read',
            'Historial',
            'Read All Historial',
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: "Historial obtenido correctamente...",
            data: {
                historial: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error en getAllHistorial...",
            error: error.message
        });
    }
};

const getUsuarioHistorialHandler = async (req,res) => {
    
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El id es obligatorio...');
    if (isNaN(id)) errores.push('El id debe ser un número entero...');
    if (isNaN(page)) errores.push('El page debe ser un número entero...');
    if (page <= 0) errores.push('El page debe ser mayor que cero...');
    if (isNaN(limit)) errores.push('El limit debe ser un número entero...');
    if (limit <= 0) errores.push('El limit debe ser mayor que cero...');
    if (errores.length > 0) return res.status(400).json({ errores });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const validate = await validateUsuarioHistorial(id);
        if (!validate) {
            return res.status(400).json({
                message: "No se encontró historial para este usuario...",
                data: []
            })
        }

        const response = await getUsuarioHistorial(numPage, numLimit, id);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) {
            return res.status(404).json({
                message: "Página fuera de rango...",
                data: {
                    historial: [],
                    currentPage: numPage,
                    pageCount: response.data.length,
                    totalCount: response.totalCount,
                    totalPages: totalPages,
                }
            });
        }

        const historial = await createHistorial(
            'read',
            'Historial',
            `Read Historial of User ${id}`,
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: "Historial obtenido correctamente...",
            data: {
                historial: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error en getUsuarioHistorial...",
            error: error.message
        });
    }
};

module.exports = {
    getAllHistorialHandler,
    getUsuarioHistorialHandler
};