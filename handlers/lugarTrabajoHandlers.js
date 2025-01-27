const {
    getLugarTrabajos,
    createLugarTrabajo,
    getLugarTrabajo,
    updateLugarTrabajo,
    deleteLugarTrabajo
} = require('../controllers/lugarTrabajoController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos los lugares de trabajo con paginación y búsqueda :
const getLugarTrabajosHandler = async (req, res) => {

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
        const response = await getLugarTrabajos(numPage, numLimit, filters);
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
            message: 'Lugares de trabajo obtenidos exitosamente...',
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
            message: 'Error interno al obtener todos los lugares de trabajo',
            error: error.message
        })
    }
};

// Handler para obtener un lugar de trabajo :
const getLugarTrabajoHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getLugarTrabajo(id);
        if (!response) return res.status(200).json({
            message: 'Lugar de trabajo no encontrado',
            data: []
        });

        return res.status(200).json({
            message: 'Lugar de trabajo encontrado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener el lugar de trabajo',
            error: error.message
        });
    }
};

// Handlers para crear un lugar de trabajo :
const createLugarTrabajoHandler = async (req, res) => {
    
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
        const response = await createLugarTrabajo(nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear el lugar de trabajo...',
            data: []
        });

        const historial = await createHistorial('create', 'LugarTrabajo', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del lugar de trabajo ${nombre} al historial`);

        return res.status(200).json({
            message: 'Lugar de trabajo creado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear el lugar de trabajo',
            error: error.message
        });
    }
};

// Handler para actualizar un lugar de trabajo :
const updateLugarTrabajoHandler = async (req, res) => {

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
        const previo = await getLugarTrabajo(id);
        if (!previo) return res.status(200).json({
            message: 'Lugar de trabajo no encontrado',
            data: []
        });

        const response = await updateLugarTrabajo(id, nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar el lugar de trabajo...',
            data: []
        });

        const historial = await createHistorial('update', 'LugarTrabajo', previo, response, token);
        if (!historial) console.warn(`No se agregó la actualización del lugar de trabajo ${previo.nombre} al historial`);

        return res.status(200).json({
            message: 'Lugar de trabajo actualizado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar el lugar de trabajo',
            error: error.message
        });
    }
};

// Handler para eliminar un lugar de trabajo :
const deleteLugarTrabajoHandler = async (req, res) => {
    
    const { id } = req.params;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await deleteLugarTrabajo(id);
        if (!response) return res.status(200).json({
            message: 'Lugar de trabajo no encontrado',
            data: []
        });

        const historial = await createHistorial('delete', 'LugarTrabajo', response, null, token);
        if (!historial) console.warn(`No se agregó la eliminación del lugar de trabajo ${response.nombre} al historial`);

        return res.status(200).json({
            message: 'Lugar de trabajo eliminado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar el lugar de trabajo',
            error: error.message
        });
    }
};

module.exports = {
    getLugarTrabajosHandler,
    getLugarTrabajoHandler,
    createLugarTrabajoHandler,
    updateLugarTrabajoHandler,
    deleteLugarTrabajoHandler
};
