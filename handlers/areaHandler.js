const {
    getArea,
    getAllAreas,
    createArea,
    updateArea,
    deleteArea
} = require('../controllers/areaController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener un área determinada :
const getAreaHandler = async (req, res) => {

    const id = req.params.id;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getArea(id);
        if (!response) return res.status(200).json({
            message: 'Área no encontrada',
            data: []
        });

        return res.status(200).json({
            message: 'Área encontrada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al buscar el área por ID',
            error: error.message
        });
    }
};

// Handler para obtener todas las áreas :
const getAllAreasHandler = async (req, res) => {

    const { page = 1, limit = 20, search } = req.query;
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
        const response = await getAllAreas(numPage, numLimit, filters);
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
            message: 'Áreas obtenidas exitosamente...',
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
            message: 'Error interno al obtener todas las áreas',
            error: error.message
        });
    }
}

// Handler para crear un área determinada :
const createAreaHandler = async (req, res) => {

    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombre) errores.push('El nombre es un parámetro obligatorio');
    if (typeof nombre !== 'string') errores.push('El nombre debe ser una cadena de texto');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await createArea(nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear el área',
            data: []
        });

        const historial = await createHistorial('create', 'Area', null, response, token);
        if (!historial) console.warn('No se agregó la creación del área al historial...');

        return res.status(200).json({
            message: 'Área creada exitosamente',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear un área',
            error: error.message
        });
    }
};

// Handler para actualizar un área determinada :
const updateAreaHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El ID es un parámetro obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (!nombre) errores.push('El nombre es un parámetro obligatorio');
    if (typeof nombre !== 'string') errores.push('El nombre debe ser una cadena de texto');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const previo = await getArea(id);
        if (!previo) return res.status(200).json({
            message: 'Área no encontrada',
            data: []
        });

        const response = await updateArea(id, nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar la función',
            data: []
        });

        const historial = await createHistorial('update', 'Area', previo, response, token);
        if (!historial) console.warn('No se agregó la actualización del área al historial...');

        return res.status(200).json({
            message: 'Área actualizada con éxito...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar el área',
            error: error.message
        });
    }
};

// Handler para eliminar un área determinada :
const deleteAreaHandler = async (req, res) => {

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
        const response = await deleteArea(id);

        if (!response) return res.status(200).json({
            message: 'Área no encontrada...',
            data: []
        });

        const historial = await createHistorial('delete', 'Area', response, null, token);
        if (!historial) console.warn('No se agregó la eliminación del área al historial...');

        return res.status(200).json({
            message: 'Área eliminada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar el área',
            error: error.message });
    }
};

module.exports = {
    getAreaHandler,
    getAllAreasHandler,
    createAreaHandler,
    updateAreaHandler,
    deleteAreaHandler
};