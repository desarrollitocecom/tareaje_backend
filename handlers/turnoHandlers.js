const { 
    getTurnos,
    getTurno,
    createTurno,
    updateTurno,
    deleteTurno
} = require('../controllers/turnoController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos los turnos con paginación y búsqueda :
const getTurnosHandler = async (req, res) => {

    const { page = 1, limit = 20, search } = req.query;
    const filters = { search };
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores,
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getTurnos(numPage, numLimit, filters);
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
            message: 'Turnos obtenidos exitosamente...',
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
            message: 'Error interno al obtener todas los turnos',
            error: error.message
        });
    }
};

// Handler para obtener un turno por ID : 
const getTurnoHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores,
    });
    
    try {
        const response = await getTurno(id);
        if (!response) return res.status(200).json({
            message: 'Turno no encontrado',
            data: []
        });

        return res.status(200).json({
            message: 'Turno encontrado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener el turno por ID',
            error: error.message
        });
    }
};

// Handler para crear un turno :
const createTurnoHandler = async (req, res) => {
    
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
        const response = await createTurno(nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear el turno...',
            data: []
        });

        const historial = await createHistorial('create', 'Turno', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del turno ${nombre} al historial`);

        return res.status(200).json({
            message: 'Turno creado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear el turno',
            error: error.message
        });
    }
};

// Handler para actualizar un turno :
const updateTurnoHandler = async (req, res) => {

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
        const previo = await getTurno(id);
        if (!previo) return res.status(200).json({
            message: 'Turno no encontrado',
            data: []
        });

        const response = await updateTurno(id, nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar el turno...',
            data: []
        });

        const historial = await createHistorial('update', 'Turno', previo, response, token);
        if (!historial) console.warn(`No se agregó la actualización del turno ${previo.nombre} al historial`);

        return res.status(200).json({
            message: 'Turno actualizado exitosamente...',
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar el turno',
            error: error.message
        });
    }
};

// Handler para eliminar un turno :
const deleteTurnoHandler = async (req, res) => {

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
        const response = await deleteTurno(id);
        if (!response) return res.status(200).json({
            message: 'Turno no encontrado',
            data: []
        });

        const historial = await createHistorial('delete', 'Turno', response, null, token);
        if (!historial) console.warn(`No se agregó la eliminación del turno ${response.nombre} al historial`);

        return res.status(200).json({
            message: 'Turno eliminado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener al eliminar el turno',
            error: error.message
        });
    }
};

module.exports = {
    getTurnosHandler,
    getTurnoHandler,
    createTurnoHandler,
    updateTurnoHandler,
    deleteTurnoHandler
}