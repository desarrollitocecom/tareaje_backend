const {
    getAllFeriados,
    getFeriado,
    getFeriadoTipos,
    createFeriado,
    updateFeriado,
    deleteFeriado
}= require("../controllers/feriadoController");

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos los feriados con paginación, búsqueda y filtro :
const getAllFeriadosHandler = async (req, res) => {
    
    
    const { page = 1, limit = 20, search, tipo, inicio, fin } = req.query;
    const filters = { search, tipo, tipo, inicio, fin }
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
        const response = await getAllFeriados(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if(numPage > totalPages) return res.status(200).json({
            message: 'Página fuera de rango...',
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
            message: 'Feriados obtenidos exitosamente...',
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
            message: 'Error interno al obtener todos los feriados',
            error: error.message
        })
    }
};

// Handler para obtener un feriado por ID :
const getFeriadoHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getFeriado(id);
        if (!response) return res.status(200).json({
            message: 'No se obtuvieron los tipos de feriado...',
            data: []
        });

        return res.status(200).json({
            message: 'Tipos de feriado encontrado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener el feriado',
            error: error.message
        });
    }
};

// Handler para obtener un feriado por ID :
const getFeriadoTiposHandler = async (req, res) => {

    try {
        const response = await getFeriadoTipos();
        if (!response) return res.status(200).json({
            message: 'Feriado no encontrado',
            data: []
        });

        return res.status(200).json({
            message: 'Feriado encontrado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener los tipos de feriado',
            error: error.message
        });
    }
};

// Handler para crear un feriado :
const createFeriadoHandler = async (req, res) => {

    const { nombre, fecha, id_feriado_tipo } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombre) errores.push('El nombre es obligatorio');
    if (typeof nombre !== 'string') errores.push('El nombre debe ser una cadena de texto');
    if (nombre.length > 255) errores.push('El nombre no debe exceder los 255 caracteres');
    if (!fecha) errores.push('La fecha es obligatoria');
    if (isNaN(Date.parse(fecha))) errores.push('La fecha debe cumplir con el formato válido (YYYY-MM-DD)');
    if (!id_feriado_tipo) errores.push('El tipo de feriado es obligatorio');
    if (isNaN(id_feriado_tipo)) errores.push('El tipo de feriado debe ser un entero');

    if (errores.length > 0)  return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores
    });

    try {
        const response = await createFeriado(nombre, fecha, id_feriado_tipo);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear el feriado...',
            data: []
        });

        const historial = await createHistorial('create', 'Feriado', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del feriado ${nombre} al historial`);

        return res.status(200).json({
            message: 'Feriado creado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear el feriado',
            error: error.message
        });
    }
};

// Handler para actualizar un feriado :
const updateFeriadoHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre, fecha, id_feriado_tipo } = req.body;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El campo ID es requerido');
    if (isNaN(id)) errores.push('El campo ID debe ser un número válido');
    if (!nombre) errores.push('El nombre es obligatorio');
    if (typeof nombre !== 'string') errores.push('El nombre debe ser una cadena de texto');
    if (nombre.length > 255) errores.push('El nombre no debe exceder los 255 caracteres');
    if (!fecha) errores.push('La fecha es obligatoria');
    if (isNaN(Date.parse(fecha))) errores.push('La fecha debe cumplir con el formato válido (YYYY-MM-DD)');
    if (!id_feriado_tipo) errores.push('El tipo de feriado es obligatorio');
    if (isNaN(id_feriado_tipo)) errores.push('El tipo de feriado debe ser un entero');

    if (errores.length > 0)  return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores
    });

    try {
        const previo = await getFeriado(id);
        if (!previo) return res.status(200).json({
            message: 'Feriado no encontrado',
            data: []
        });

        const response = await updateFeriado(id, nombre, fecha, id_feriado_tipo);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar el feriado...',
            data: []
        });

        const historial = await createHistorial('update', 'Feriado', previo, response, token);
        if (!historial) console.warn(`No se agregó la actualización del feriado ${previo.nombre} al historial`);

        return res.status(200).json({
            message: 'Feriado actualizado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar el feriado',
            error: error.message
        });
    }
};

// Handler para eliminar un feriado
const deleteFeriadoHandler = async (req, res) => {

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
        const response = await deleteFeriado(id);
        if (!response) return res.status(200).json({
            message: 'Feriado no encontrado',
            data: []
        });

        const historial = await createHistorial('delete', 'Feriado', response, null, token);
        if (!historial) console.warn(`No se agregó la eliminación del feriado ${response.nombre} al historial`);

        return res.status(200).json({
            message: 'Feriado eliminado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar el feriado',
            error: error.message
        });
    }
};

module.exports = {
    getAllFeriadosHandler,
    getFeriadoHandler,
    getFeriadoTiposHandler,
    createFeriadoHandler,
    updateFeriadoHandler,
    deleteFeriadoHandler
};
