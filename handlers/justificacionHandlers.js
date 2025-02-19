const {
    getJustificacionById,
    getAllJustificaciones,
    createJustificacion,
    updateJustificacion
} = require('../controllers/justificacionController');

const { getIdsAsistenciaRango } = require('../controllers/asistenciaController')
const { deleteFile } = require('../utils/filesFunctions');
const { createHistorial } = require('../controllers/historialController');
const path = require('path');

// Handler para obtener la justificación por ID :
const getJustificacionByIdHandler = async (req,res) => {
    
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'El parámetro ID es requerido' });
    if (isNaN(id)) return res.status(400).json({ message: 'El parámetro ID debe ser un entero' });

    try {
        const justificacion = await getJustificacionById(id);
        if (!justificacion){
            return res.status(400).json({
                message: 'La justificación no fue encontrada para este ID...',
                data: []
            });
        }

        return res.status(200).json({
            message: 'Justificación obtenida correctamente...',
            data: justificacion
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener la justificación',
            error: error.message
        });
    }
};

// Handler para obtener todas las justificaciones con paginación :
const getAllJustificacionesHandler = async (req, res) => {
    
    const { page = 1, limit = 20 } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page < 0) errores.push('El page debe ser un entero mayor a cero');
    if (isNaN(limit)) errores.push('El limit debe ser un entero');
    if (limit <= 0) errores.push('El limit debe ser un entero mayor a cero');
    
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllJustificaciones(numPage, numLimit);
        const totalPages = Math.ceil(response.total / numLimit);

        if (numPage > totalPages) {
            return res.status(200).json({
                message: "Página fuera de rango...",
                data: {
                    data: [],
                    currentPage: numPage,
                    pageCount: response.data.length,
                    totalCount: response.total,
                    totalPages: totalPages,
                }
            });
        }

        return res.status(200).json({
            message: 'Mostrando justificaciones...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.total,
                totalPages: totalPages,
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener las justificaciones',
            error: error.message
        });
    }
};

// Handler para crear la justificación de una sola fecha :
const createJustificacionHandler = async (req, res) => {

    const { descripcion, tipo, fecha, id_empleado } = req.body;
    const token = req.user;
    const errores = [];
    //if (!descripcion) errores.push('La descripción es un campo obligatorio');
    if (!tipo) errores.push('El tipo es un campo obligatorio');
    if (!fecha) errores.push('La fecha es un campo obligatorio');
    if (!id_empleado) errores.push('El ID del empleado es un campo obligatorio');
    //if (typeof descripcion !== 'string') errores.push('La descripción debe ser una cadena de texto');
    if (!['A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF'].includes(tipo)) errores.push('El tipo debe ser [A,F,DO,DL,DC,LF,N,DM,LSG,LCG,SSG,V,R,DF]');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.push('EL formato de la fecha es incorrecto, debe ser YYYY-MM-HH');
    if (isNaN(id_empleado)) errores.push('El ID del empleado debe ser un entero');

    if (errores.length > 0) {
        if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
        const asistencia = await getIdsAsistenciaRango(id_empleado, fecha, fecha);
        if (!asistencia) {
            if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
            return res.status(404).json({
                message: 'No se registra asistencia para este día...',
                data: []
            });
        }

        // Guardar la ruta de los PDFs :
        let documentos = null;
        if (req.files || req.files.length > 0) documentos = req.files.map((file) => `uploads/pdfs/${file.filename}`);

        // Validar que el estado no sea el mismo de la asistencia registrada :
        const estado = asistencia.info[0].estado;
        if (tipo === estado) return res.status(400).json({
            message: 'El estado es el mismo de la asistencia registrada, por favor cambiarlo...',
            data: []
        });

        // Crear la justificación para ese día :
        const ids = [];
        ids.push(asistencia.info[0].id);
        const descripcion_a = (descripcion) ? descripcion : null
        const response = await createJustificacion(documentos, descripcion_a, tipo, fecha, fecha, ids, id_empleado, estado);

        if (!response) {
            if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'No se pudo crear la justificación...',
                data: [],
            });
        }

        const historial = await createHistorial('create', 'Justificacion', null, response, token);
        if (!historial) console.warn('No se agregó la creación de la justificación en una fecha al historial');

        return res.status(200).json({
            message: 'Justificación creada exitosamente...',
            data: response,
        });

    } catch (error) {
        if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
        return res.status(500).json({
            message: 'Error interno al crear la justificación',
            error: error.message,
        });
    }
};

// Handler para crear la justificación de un rango de fechas :
const createJustificacionRangoHandler = async (req, res) => {

    const { descripcion, tipo, f_inicio, f_fin, id_empleado } = req.body;
    const token = req.user;
    const errores = [];
    
    if (!descripcion) errores.push('La descripción es un campo obligatorio');
    if (!tipo) errores.push('El tipo es un campo obligatorio');
    if (!f_inicio) errores.push('La fecha de inicio es un campo obligatorio');
    if (!f_fin) errores.push('La fecha de fin es un campo obligatorio');
    if (!id_empleado) errores.push('El ID del empleado es un campo obligatorio');

    if (typeof descripcion !== 'string') errores.push('La descripción debe ser una cadena de texto');
    if (!['A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF'].includes(tipo)) errores.push('El tipo debe ser [A,F,DO,DL,DC,LF,N,DM,LSG,LCG,SSG,V,R,DF]');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_inicio)) errores.push('EL formato de la fecha de inicio es incorrecto, debe ser YYYY-MM-HH');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_fin)) errores.push('EL formato de la fecha de fin es incorrecto, debe ser YYYY-MM-HH');
    if (isNaN(id_empleado)) errores.push('El ID del empleado debe ser un entero');

    // Formato de envío de errores de validaciones :
    if (errores.length > 0) {
        if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores
        });
    }

    try {
        const datos = await getIdsAsistenciaRango(id_empleado, f_inicio, f_fin);
        if (!datos) {
            if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
            return res.status(404).json({
                message: `No se obtuvieron las asistencias desde ${f_inicio} hasta ${f_fin}`,
                data: []
            });
        }

        // Guardar la ruta de los PDFs :
        let documentos = null;
        if (req.files || req.files.length > 0) documentos = req.files.map((file) => `uploads/pdfs/${file.filename}`);

        // Obtener un array del rango de fechas :
        const dates = [];
        let currentDate = new Date(f_inicio);
        while (currentDate <= new Date(f_fin)) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const estados = [];
        const ids = [];
        const nulos = [];

        for (const date of dates) {
            const asistencia = datos.info.find(d => d.fecha === date);
            if (!asistencia) {
                nulos.push(date);
                continue;
            }
            estados.push(asistencia.estado);
            ids.push(asistencia.id);
        }

        // Formato de envío de errores en caso no haya asistencia en un día específico :
        if (nulos.length > 0) {
            if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
            return res.status(404).json({
                message: 'No se obtuvieron las asistencias para estos días...',
                data: nulos,
            });
        }

        const response = await createJustificacion(documentos, descripcion, tipo, f_inicio, f_fin, ids, id_empleado, token);
        if (!response) {
            if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'No se pudo crear la justificación...',
                data: [],
            });
        }

        const historial = await createHistorial('create', 'Justificacion', null, response, token);
        if (!historial) console.warn('No se agregó la creación de la justificación en un rango de fechas al historial');

        return res.status(200).json({
            message: 'Justificación creada exitosamente...',
            data: response,
        });

    } catch (error) {
        if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
        return res.status(500).json({
            message: 'Error interno al crear la justificación',
            error: error.message
        });
    }
};

// Handler para actualizar una justificación :
const updateJustificacionHandler = async (req, res) => {

    const { id } = req.params;
    const { descripcion } = req.body;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    // if (isNaN(id)) errores.push('El ID debe ser un entero');
    // if (!tipo) errores.push('El tipo es un campo obligatorio');
    // if (!f_inicio) errores.push('La fecha de inicio es un campo obligatorio');
    // if (!f_fin) errores.push('La fecha de fin es un campo obligatorio');
    // if (!id_empleado) errores.push('El ID del empleado es un campo obligatorio');

    // if (typeof descripcion !== 'string') errores.push('La descripción debe ser una cadena de texto');
    // if (!['A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF'].includes(tipo)) errores.push('El tipo debe ser [A,F,DO,DL,DC,LF,N,DM,LSG,LCG,SSG,V,R,DF]');
    // if (!/^\d{4}-\d{2}-\d{2}$/.test(f_inicio)) errores.push('EL formato de la fecha de inicio es incorrecto, debe ser YYYY-MM-HH');
    // if (!/^\d{4}-\d{2}-\d{2}$/.test(f_fin)) errores.push('EL formato de la fecha de fin es incorrecto, debe ser YYYY-MM-HH');
    // if (isNaN(id_empleado)) errores.push('El ID del empleado debe ser un entero');

    // Formato de envío de errores de validaciones :
    if (errores.length > 0) {
        //if (req.files || req.files.length > 0) for (const file of req.files) await deleteFile(file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores
        });
    }

    try {
        const previo = await getJustificacionById(id);
        if (!previo) return res.status(404).json({
            message: 'Justificación no encontrada',
            data: []
        });

        const response = await updateJustificacion(id, descripcion);
        if (!response) return res.status(400).json({
            message: 'No se pudo actualizar la justificación...',
            data: []
        });

        const historial = await createHistorial('update', 'Justificacion', previo, response, token);
        if (!historial) console.warn('No se agregó la actualización de la justificación al historial');

        return res.status(200).json({
            message: 'Justificación actualizada con éxito...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar la justificación...',
            error: error.message
        });
    }
};

module.exports = {
    getJustificacionByIdHandler,
    getAllJustificacionesHandler,
    createJustificacionHandler,
    createJustificacionRangoHandler,
    updateJustificacionHandler
};
