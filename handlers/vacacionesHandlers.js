const {
    getVacacion,
    getVacacionById,
    getVacaciones,
    createVacacion,
    updateVacacion,
    deleteVacacion,
} = require("../controllers/vacacionesController.js");

const {
    validateAsistencia,
    createAsistencia,
    updateAsistencia
} = require('../controllers/asistenciaController')

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener una vacación por ID :
const getVacacionHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getVacacion(id);
        if (!response) return res.status(200).json({
            message: 'Vacación no encontrado',
            data: []
        });

        return res.status(200).json({
            message: 'Vacación obtenida exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener una vacación por ID',
            error: error.message
        });
    }
};

// Handler para obtener todas las vacaciones :
const getVacacionesHandler = async (req, res) => {

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
        const response = await getVacaciones(numPage, numLimit);
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
        });
        
        return res.status(200).json({
            message: 'Vacaciones obtenidas exitosamente...',
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
            message: 'Error interno al obtener todas las vacaciones',
            error: error.message
        });
    }
};

// Handler para crear una vacación :
const createVacacionHandler = async (req, res) => {

    const { f_inicio, f_fin, id_empleado }= req.body;
    const token = req.user;
    const errores = [];

    if(!f_inicio) errores.push('El parámetro fecha de inicio es obligatorio');
    if(!f_fin) errores.push('El parámetro fecha de fin es obligatorio');
    if(!id_empleado) errores.push('El parámetro ID del empleado es obligatorio');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(f_inicio)) errores.push('La fecha de inicio necesita tener el formato YYYY-MM-HH');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(f_fin)) errores.push('La fecha de fin necesita tener el formato YYYY-MM-HH');
    if (isNaN(id_empleado) || id_empleado <= 0) errores.push('El ID de empleado debe ser un entero positivo');

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });
  
    try {
        const before = [];
        const date = new Date(f_inicio);
        const fin = new Date(f_fin);
        while (date <= fin) {
            const fecha =  date.toISOString().split('T')[0];
            const result = await validateAsistencia(fecha, id_empleado);
            const estado = (result) ? result.estado : null;
            before.push({ fecha, estado });
            if (!result) await createAsistencia(fecha, '00:00:00', 'V', id_empleado, 'Sin Foto');
            else if (['DL','DO','DC'].includes(estado)) await updateAsistencia(result.id, fecha, result.hora, estado, id_empleado, result.photo_id, result.evidencia);
            else await updateAsistencia(result.id, fecha, result.hora, 'V', id_empleado, result.photo_id, result.evidencia);
            date.setDate(date.getDate() + 1);
        }

        const response = await createVacacion(f_inicio, f_fin, id_empleado, before);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear la vacación',
            data: []
        });

        const historial = await createHistorial('create', 'Vacacion', null, response, token);
        if (!historial) console.warn('No se agregó la creación de la vacación al historial');

        return res.status(200).json({
            message: 'Vacación creada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear la vacación',
            error: error.message
        });
    }
};

// Handler para actualizar una vacación :
const updateVacacionHandler = async (req,res) => {

    const { id } = req.params;
    const { f_inicio, f_fin, id_empleado } = req.body;
    const token = req.user;
    const errores = [];

    if(!f_inicio) errores.push('El parámetro fecha de inicio es obligatorio');
    if(!f_fin) errores.push('El parámetro fecha de fin es obligatorio');
    if(!id_empleado) errores.push('El parámetro ID del empleado es obligatorio');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(f_inicio)) errores.push('La fecha de inicio necesita tener el formato YYYY-MM-HH');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(f_fin)) errores.push('La fecha de fin necesita tener el formato YYYY-MM-HH');
    if (isNaN(id_empleado) || id_empleado <= 0) errores.push('El ID de empleado debe ser un entero positivo');

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const previo = await getVacacionById(id);
        if (!previo) return res.status(200).json({
            message: 'Vacación no encontrada',
            data: []
        });
        
        for (const bf of previo.before) {
            const result = await validateAsistencia(bf.fecha, previo.id_empleado);
            if (result) await updateAsistencia(result.id, bf.fecha, result.hora, bf.estado, previo.id_empleado, result.photo_id, result.evidencia);
            else console.warn('No se pudo eliminar la vacación a la Asistencia');
        }

        const before = [];
        const date = new Date(f_inicio);
        const fin = new Date(f_fin);
        while (date <= fin) {
            const fecha =  date.toISOString().split('T')[0];
            const result = await validateAsistencia(fecha, id_empleado);
            const estado = (result) ? result.estado : null;
            before.push({ fecha, estado });
            if (!result) await createAsistencia(fecha, '00:00:00', 'V', id_empleado, 'Sin Foto');
            else await updateAsistencia(result.id, fecha, result.hora, 'V', id_empleado, result.photo_id, result.evidencia);
            date.setDate(date.getDate() + 1);
        }
        
        const response = await updateVacacion(id ,f_inicio, f_fin, id_empleado, before);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar la vacación...',
            data: []
        });

        const historial = await createHistorial('update', 'Vacacion', previo, response, token);
        if (!historial) console.warn('No se agregó la actualización de la vacación al historial');

        return res.status(200).json({
            message: 'Vacación actualizada exitosamente...',
            data: response
        });
      
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar la vacación',
            error: error.message
        });
    }
};

// Handler para eliminar una vacación :
const deleteVacacionesHandler = async (req, res) => {

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
        const response = await deleteVacacion(id);
        if (!response) return res.status(200).json({
            message: 'Vacacion no encontrado',
            data: []
        });

        for (const bf of response.before) {
            const result = await validateAsistencia(bf.fecha, response.id_empleado);
            if (result) await updateAsistencia(result.id, bf.fecha, result.hora, bf.estado, response.id_empleado, result.photo_id, result.evidencia);
            else console.warn('No se pudo eliminar la vacación a la Asistencia');
        }

        const historial = await createHistorial('delete', 'Vacacion', response, null, token);
        if (!historial) console.warn('No se agregó la eliminación de la vacación al historial');

        return res.status(200).json({
            message: 'Vacación eliminada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar la vacación',
            error: error.message
        });
    }
};

module.exports = {
  createVacacionHandler,
  getVacacionesHandler,
  getVacacionHandler,
  deleteVacacionesHandler,
  updateVacacionHandler
};
