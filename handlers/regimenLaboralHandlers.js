const {
    getRegimenLaborales,
    createRegimenLaboral,
    getRegimenLaboral,
    updateRegimenLaboral,
    deleteRegimenLaboral
} = require('../controllers/regimenLaboralController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos los regímenes laborales con paginación y búsqueda :
const getRegimenLaboralesHandler = async (req, res) => {

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
        const response = await getRegimenLaborales(numPage, numLimit, filters);
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
            message: 'Regimenes laborales obtenidos exitosamente...',
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
            message: 'Error interno al obtener todos los régimenes laborales',
            error: error.message
        })
    }
};

// Handler para obtener todos los régimenes laborales :
const getRegimenLaboralHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getRegimenLaboral(id);
        if (!response) return res.status(200).json({
            message: 'Régimen laboral no encontrado',
            data: []
        });

        return res.status(200).json({
            message: 'Régimen laboral encontrado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener el régimen laboral',
            error: error.message
        });
    }
};

// Handler para crear un régimen laboral :
const createRegimenLaboralHandler = async (req, res) => {

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
        const response = await createRegimenLaboral(nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear el régimen laboral...',
            data: []
        });

        const historial = await createHistorial('create', 'RegimenLaboral', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del régimen laboral ${nombre} al historial`);

        return res.status(200).json({
            message: 'Régimen laboral creado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear el régimen laboral',
            error: error.message
        });
    }
};

// Handler para actualizar un régimen laboral :
const updateRegimenLaboralHandler = async (req, res) => {

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
        const previo = await getRegimenLaboral(id);
        if (!previo) return res.status(200).json({
            message: 'Régimen laboral no encontrado',
            data: []
        });

        const response = await updateRegimenLaboral(id, nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar el régimen laboral...',
            data: []
        });

        const historial = await createHistorial('update', 'RegimenLaboral', previo, response, token);
        if (!historial) console.warn(`No se agregó la actualización del régimen laboral ${previo.nombre} al historial`);

        return res.status(200).json({
            message: 'Régimen laboral actualizado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar el régimen laboral',
            error: error.message
        });
    }
};

// Handler para eliminar un régimen laboral :
const deleteRegimenLaboralHandler = async (req, res) => {

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
        const response = await deleteRegimenLaboral(id);
        if (!response) return res.status(200).json({
            message: 'Régimen laboral no encontrado',
            data: []
        });

        const historial = await createHistorial('delete', 'RegimenLaboral', response, null, token);
        if (!historial) console.warn(`No se agregó la eliminación del régimen laboral ${response.nombre} al historial`);

        return res.status(200).json({
            message: 'Régimen laboral eliminado exitosamente...',
            data: response
        });


    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar el régimen laboral',
            error: error.message
        });
    }
};

module.exports = {
    getRegimenLaboralesHandler,
    getRegimenLaboralHandler,
    createRegimenLaboralHandler,
    updateRegimenLaboralHandler,
    deleteRegimenLaboralHandler
};
