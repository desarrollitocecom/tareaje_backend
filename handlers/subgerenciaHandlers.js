const {
    getSubgerencias,
    createSubgerencia,
    getSubgerencia,
    updateSubgerencia,
    deleteSubgerencia
} = require('../controllers/subgerenciaController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos las subgerencias con paginación y búsqueda :
const getSubgerenciasHandler = async (req, res) => {
    
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
        const response = await getSubgerencias(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) return res.status(200).json({
            message:'Página fuera de rango...',
            data:{
                data:[],
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
                }
            }
        );
        
        return res.status(200).json({
            message: 'Subgerencias obtenidas exitosamente...',
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
            message: 'Error interno al obtener todas las subgerencias',
            error: error.message
        });
    }
}

// Handler para obtener una subgerencia por ID :
const getSubgerenciaHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores,
    });

    try {
        const response = await getSubgerencia(id);
        if (!response) return res.status(200).json({
            message: 'Subgerencia no encontrada',
            data: []
        });

        return res.status(200).json({
            message: 'Subgerencia encontrada exitosamente...',
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener la subgerencia por ID',
            error: error.message
        });
    }
};

// Handler para crear una subgerencia :
const createSubgerenciaHandler = async (req, res) => {

    const { nombre } = req.body;
    const token = req.user;
    const errores = [];
    
    if (!nombre) errores.push('El campo nombre es requerido');
    if (typeof nombre !== 'string') errores.push('El campo nombre debe ser una cadena de texto');

    if (errores.length > 0)  return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const response = await createSubgerencia(nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear la subgerencia...',
            data: []
        });
        
        const historial = await createHistorial('create', 'Subgerencia', null, response, token);
        if (!historial) console.warn(`No se agregó la creación de la subgerencia ${nombre} al historial`);

        return res.status(201).json({
            message: 'Subgerencia creada exitosamente...',
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear la subgerencia',
            error: error.message
        });
    }
};

// Handler para actualizar una subgerencia :
const updateSubgerenciaHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El campo ID es requerido');
    if (isNaN(id)) errores.push('El campo ID debe ser un número válido');
    if (!nombre) errores.push('El campo nombre es requerido');
    if (typeof nombre !== 'string') errores.push('El campo nombre debe ser una cadena de texto');

    if (errores.length > 0)  return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const previo = await getSubgerencia(id);
        if (!previo) return res.status(200).json({
            message: 'Subgerencia no encontrada',
            data: []
        });

        const response = await updateSubgerencia(id, nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar la subgerencia...',
            data: []
        });

        const historial = await createHistorial('update', 'Subgerencia', previo, response, token);
        if (!historial) console.warn(`No se agregó la actualización de la subgerencia ${previo.nombre} al historial`);

        return res.status(200).json({
            message: 'Subgerencia actualizada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar la subgerencia',
            error: error.message
        });
    }
};

// Handler para eliminar una subgerencia :
const deleteSubgerenciaHandler = async (req, res) => {
    
    const { id } = req.params;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores,
    });

    try {
        const response = await deleteSubgerencia(id);
        if (!response) return res.status(200).json({
            message: 'Subgerencia no encontrada',
            data: []
        });

        const historial = await createHistorial('delete', 'Subgerencia', response, null, token);
        if (!historial) console.warn(`No se agregó la eliminación de la subgerencia ${response.nombre} al historial`);

        return res.status(200).json({
            message: 'Subgerencia eliminada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener al eliminar la subgerencia',
            error: error.message
        });
    }
};

module.exports = {
    getSubgerenciasHandler,
    getSubgerenciaHandler,
    createSubgerenciaHandler,
    updateSubgerenciaHandler,
    deleteSubgerenciaHandler
}