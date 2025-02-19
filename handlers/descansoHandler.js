const {
    getDescanso,
    getDescansoById,
    getAllDescansos,
    getDescansosRango,
    getDescansoState,
    createDescanso,
    recreateDescanso,
    updateDescanso,
    deleteDescanso
} = require("../controllers/descansoController");

const {
    validateAsistencia,
    createAsistencia,
    updateAsistencia
} = require('../controllers/asistenciaController')

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener un descanso por ID :
const getDescansoHandler = async (req, res) => {

    const id = parseInt(req.params.id);
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getDescanso(id);
        if (!response) return res.status(200).json({
            message: 'Descanso no encontrado',
            data: []
        });

        return res.status(200).json({
            message: 'Descanso obtenido exitosamente...',
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener un descanso por ID',
            error: error.message
        });
    }
};

// Handler para obtener todos los descansos con paginación :
const getAllDescansosHandler = async (req, res) => {

    const { page = 1, limit = 20  } = req.query;
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
        const response = await getAllDescansos(numPage, numLimit);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if(numPage > totalPages) return res.status(200).json({
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
            message: 'Descansos obtenidos exitosamente...',
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
            message: 'Error interno al obtener todos los cargos en el handler',
            error: error.message
        });
    }
};

// Handler para obtener todos los descansos (de todo tipo) por rango de fechas :
const getDescansosRangoHandler = async (req, res) => {

    const { inicio, fin } = req.body;
    const { page = 1, limit = 20, search, subgerencia, turno, cargo, regimen, lugar, sexo, dni, funcion } = req.query;
    const filters = { search, subgerencia, turno, cargo, regimen, lugar, sexo, dni, funcion };
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un número entero...');
    if (page < 0) errores.push('El page debe ser mayor que cero...');
    if (isNaN(limit)) errores.push('El limit debe ser un número entero...');
    if (limit <= 0) errores.push('El limit debe ser mayor que cero...');
    if (!inicio) errores.push('La fecha de inicio es obligatoria...');
    if (!fin) errores.push('La fecha de fin es obligatoria...');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio)) errores.push('El formato para INICIO es incorrecto, debe ser YYYY-MM-HH)');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fin)) errores.push('El formato para FIN es incorrecto, debe ser YYYY-MM-HH');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getDescansosRango(numPage, numLimit, inicio, fin, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) return res.status(200).json({
            message: "Página fuera de rango...",
            data: {
                data: [],
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

        return res.status(200).json({
            message: `Mostrando las descansos del ${inicio} al ${fin}`,
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
            message: 'Error interno al obtener los descansos en un rango de fechas...',
            error: error.message
        });
    }
};

// Handler para crear un descanso :
const createDescansoHandler = async (req, res) => {

    const { fecha, tipo, observacion, id_empleado } = req.body;
    const token = req.user;
    const errores = [];
    const config_observacion = (observacion) ? observacion : null;

    if (!fecha) errores.push('El parrámetro fecha es obligatorio');
    if (isNaN(Date.parse(fecha))) errores.push('El parámetro fecha debe tener el formatov YYYY-MM-DD');
    if (!tipo) errores.push('El parámetro TIPO es obligatorio');
    if (!['DL','DO','DC'].includes(tipo)) errores.push('El tipo debe ser [DL, DO, DC]');
    if (config_observacion && typeof config_observacion !== 'string') errores.push('La observación debe ser una cadena de texto');
    if (!id_empleado) errores.push('El parámetro ID de empleado es obligatorio');
    if (isNaN(id_empleado) || id_empleado <= 0) errores.push('El ID de empleado debe ser un entero positivo');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores
    });

    try {
        const result = await validateAsistencia(fecha, id_empleado);
        const before = (result) ? result.estado : null;

        let response;
        const descanso = await getDescansoState(id_empleado, fecha)

        if (descanso) response = await recreateDescanso(descanso.id, tipo, config_observacion, before);
        else response = await createDescanso(fecha, tipo, config_observacion, id_empleado, before);

        if (!response) return res.status(200).json({
            message: 'No se pudo crear el descanso',
            data: []
        });

        if (!result) await createAsistencia(fecha, '00:00:00', tipo, id_empleado, 'Sin Foto');
        else await updateAsistencia(result.id, fecha, result.hora, tipo, id_empleado, result.photo_id, result.evidencia);

        const historial = await createHistorial('create', 'Descanso', null, response, token);
        if (!historial) console.warn('No se agregó la creación del descanso al historial');

        return res.status(200).json({
            message: 'Descanso creado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear un descanso',
            error: error.message
        });
    }
};

// Handler para actualizar un descanso :
const updateDescansoHandler = async (req, res) => {

    const { id } = req.params;
    const { fecha, tipo, observacion, id_empleado } = req.body;
    const token = req.user;
    const errores = [];
    const config_observacion = (observacion) ? observacion : null;

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (!fecha) errores.push('El parrámetro fecha es obligatorio');
    if (isNaN(Date.parse(fecha))) errores.push('El parámetro fecha debe tener el formatov YYYY-MM-DD');
    if (!tipo) errores.push('El parámetro TIPO es obligatorio');
    if (!['DL','DO','DC'].includes(tipo)) errores.push('El tipo debe ser [DL, DO, DC]');
    if (config_observacion && typeof config_observacion !== 'string') errores.push('La observación debe ser una cadena de texto');
    if (!id_empleado) errores.push('El parámetro ID de empleado es obligatorio');
    if (isNaN(id_empleado) || id_empleado <= 0) errores.push('El ID de empleado debe ser un entero positivo');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores
    });

    try {
        const previo = await getDescansoById(id);
        if (!previo) return res.status(200).json({
            message: 'Descanso no encontrado',
            data: []
        });

        const response = await updateDescanso(id, fecha, tipo, config_observacion, id_empleado);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar el descanso...',
            data: []
        });

        const result = await validateAsistencia(fecha, id_empleado);
        if (!result) await createAsistencia(fecha, '00:00:00', tipo, id_empleado, 'Sin Foto');
        else await updateAsistencia(result.id, fecha, result.hora, tipo, id_empleado, result.photo_id, result.evidencia);

        const historial = await createHistorial('update', 'Descanso', previo, response, token);
        if (!historial) console.warn('No se agregó la actualización del descanso al historial...');

        return res.status(200).json({
            message: 'Descanso actualizado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar un descanso',
            error: error.message
        });
    }
};

// Handler para eliminar un descanso (cambia el estado a false) :
const deleteDescansoHandler = async (req, res) => {

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
        const response = await deleteDescanso(id);
        if (!response) return res.status(200).json({
            message: 'Descanso no encontrado',
            data: []
        });

        const historial = await createHistorial('delete', 'Descanso', response, null, token);
        if (!historial) console.warn('No se agregó la eliminación del descanso al historial');

        const result = await validateAsistencia(response.fecha, response.id_empleado);
        if (result) await updateAsistencia(result.id, result.fecha, result.hora, response.before, result.id_empleado, result.photo_id, result.evidencia);
        else console.warn('No se pudo eliminar el descanso en Asistencia');

        return res.status(200).json({
            message: 'Descanso eliminado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar un descanso',
            error: error.message
        });
    }
};

module.exports = {
    getDescansoHandler,
    getAllDescansosHandler,
    getDescansosRangoHandler,
    createDescansoHandler,
    updateDescansoHandler,
    deleteDescansoHandler
};
