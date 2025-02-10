const {
    getConvocatoria,
    getAllConvocatorias,
    createConvocatoria,
    updateConvocatoria,
    deleteConvocatoria
} = require('../controllers/convocatoriaController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener un área determinada :
const getConvocatoriaHandler = async (req, res) => {

    const id = req.params.id;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getConvocatoria(id);
        if (!response) return res.status(404).json({
            message: 'Convocatoria no encontrada',
            data: []
        });

        return res.status(200).json({
            message: 'Convocatoria encontrada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener la convocatoria por ID',
            error: error.message
        });
    }
};

// Handler para obtener todas las áreas :
const getAllConvocatoriasHandler = async (req, res) => {

    const { page = 1, limit = 20, search, mes, year } = req.query;
    const filters = { search };
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllConvocatorias(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if(numPage > totalPages)return res.status(200).json({
            message:'Página fuera de rango...',
            data: {
                data: [],
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });
        
        return res.status(200).json({
            message: 'Convocatorias obtenidas exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener todas las convocatorias',
            error: error.message
        });
    }
}

// Handler para crear un área determinada :
const createConvocatoriaHandler = async (req, res) => {

    const { mes, year, numero, f_inicio, f_fin } = req.body;
    const token = req.user;
    const errores = [];

    if (!mes) errores.push('El mes es un parámetro obligatorio');
    if (!year) errores.push('El año es un parámetro obligatorio');
    if (!numero) errores.push('El número es un parámetro obligatorio');
    if (!f_inicio) errores.push('La fecha de inicio es un campo obligatorio');
    if (!f_fin) errores.push('La fecha de fin es un campo obligatorio');
    if (isNaN(mes)) errores.push('El mes debe ser un entero');
    if (isNaN(year)) errores.push('El año debe ser un entero');
    if (isNaN(numero)) errores.push('El número debe ser un entero');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_inicio)) errores.push('EL formato de la fecha de inicio es incorrecto, debe ser YYYY-MM-HH');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_fin)) errores.push('EL formato de la fecha de fin es incorrecto, debe ser YYYY-MM-HH');

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await createConvocatoria(mes, year, numero, f_inicio, f_fin);
        if (!response) return res.status(400).json({
            message: 'No se pudo crear la convocatoria',
            data: []
        });

        const historial = await createHistorial('create', 'Convocatoria', null, response, token);
        if (!historial) console.warn('No se agregó la creación de la convocatoria al historial...');

        return res.status(200).json({
            message: 'Convocatoria creada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear la convocatoria',
            error: error.message
        });
    }
};

// Handler para actualizar un área determinada :
const updateConvocatoriaHandler = async (req, res) => {

    const { id } = req.params;
    const { mes, year, numero, f_inicio, f_fin } = req.body;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El ID es un parámetro obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (!mes) errores.push('El mes es un parámetro obligatorio');
    if (!year) errores.push('El año es un parámetro obligatorio');
    if (!numero) errores.push('El número es un parámetro obligatorio');
    if (!f_inicio) errores.push('La fecha de inicio es un campo obligatorio');
    if (!f_fin) errores.push('La fecha de fin es un campo obligatorio');
    if (isNaN(mes)) errores.push('El mes debe ser un entero');
    if (isNaN(year)) errores.push('El año debe ser un entero');
    if (isNaN(numero)) errores.push('El número debe ser un entero');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_inicio)) errores.push('EL formato de la fecha de inicio es incorrecto, debe ser YYYY-MM-HH');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_fin)) errores.push('EL formato de la fecha de fin es incorrecto, debe ser YYYY-MM-HH');

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const previo = await getConvocatoria(id);
        if (!previo) return res.status(404).json({
            message: 'Convocatoria no encontrada',
            data: []
        });

        const response = await updateConvocatoria(id, mes, year, numero, f_inicio, f_fin);
        if (!response) return res.status(400).json({
            message: 'No se pudo actualizar la convocatoria',
            data: []
        });

        const historial = await createHistorial('update', 'Convocatoria', previo, response, token);
        if (!historial) console.warn('No se agregó la actualización de la convocatoria al historial...');

        return res.status(200).json({
            message: 'Convocatoria actualizada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar la convocatoria',
            error: error.message
        });
    }
};

// Handler para eliminar un área determinada :
const deleteConvocatoriaHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El ID es un parámetro obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await deleteConvocatoria(id);
        if (!response) return res.status(404).json({
            message: 'Convocatoria no encontrada',
            data: []
        });

        const historial = await createHistorial('delete', 'Convocatoria', response, null, token);
        if (!historial) console.warn('No se agregó la eliminación de la convocatoria al historial...');

        return res.status(200).json({
            message: 'Convocatoria eliminada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar la convocatoria',
            error: error.message });
    }
};

module.exports = {
    getConvocatoriaHandler,
    getAllConvocatoriasHandler,
    createConvocatoriaHandler,
    updateConvocatoriaHandler,
    deleteConvocatoriaHandler
};