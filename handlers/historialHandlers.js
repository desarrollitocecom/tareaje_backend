const { getAllHistorial, getUsuarioHistorial } = require('../controllers/historialController');

const getAllHistorialHandler = async (req,res) => {
    
    const { page = 1, limit = 20 } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un número entero...');
    if (page <= 0) errores.push('El page debe ser mayor que cero...');
    if (isNaN(limit)) errores.push('El limit debe ser un número entero...');
    if (limit <= 0) errores.push('El limit debe ser mayor que cero...');
    if (errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await getAllHistorial(page, limit);
        const totalPages = Math.ceil(response.totalCount / limit);

        if (page > totalPages) {
            return res.status(404).json({
                message: "Página fuera de rango...",
                data: {
                    historial: [],
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: response.totalCount,
                }
            });
        }
        return res.status(200).json({
            message: "Historial obtenido correctamente...",
            data: {
                historial: response.data,
                currentPage: page,
                totalPages: totalPages,
                totalCount: response.totalCount,
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
    const errores = [];

    if (!id) errores.push('El id es obligatorio...');
    if (isNaN(id)) errores.push('El id debe ser un número entero...');
    if (isNaN(page)) errores.push('El page debe ser un número entero...');
    if (page <= 0) errores.push('El page debe ser mayor que cero...');
    if (isNaN(limit)) errores.push('El limit debe ser un número entero...');
    if (limit <= 0) errores.push('El limit debe ser mayor que cero...');
    if (errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await getUsuarioHistorial(page, limit, id);
        const totalPages = Math.ceil(response.totalCount / limit);

        if (page > totalPages) {
            return res.status(404).json({
                message: "Página fuera de rango...",
                data: {
                    historial: [],
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: response.totalCount,
                }
            });
        }
        return res.status(200).json({
            message: "Historial del usuario obtenido correctamente...",
            data: {
                historial: response.data,
                currentPage: page,
                totalPages: totalPages,
                totalCount: response.totalCount,
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