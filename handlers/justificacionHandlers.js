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
    const token = req.user;

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

        const historial = await createHistorial(
            'read',
            'Justificacion',
            `Read Justificacion Id ${id}`,
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Justificación obtenida correctamente...',
            data: justificacion
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta para obtener la justificación...',
            error: error.message
        });
    }
};

// Handler para obtener todas las justificaciones con paginación :
const getAllJustificacionesHandler = async (req, res) => {
    
    const { page = 1, limit = 20 } = req.query;
    const token = req.user;
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page <= 0) errores.push('El page debe ser un entero mayor a cero');
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
            return res.status(404).json({
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

        const historial = await createHistorial(
            'read',
            'Justificacion',
            'Read All Justificaciones',
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

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
            message: 'Error en la consulta para obtener las justificaciones...',
            error: error.message
        });
    }
};

// Handler para crear la justificación de una sola fecha :
const createJustificacionHandler = async (req, res) => {

    const { descripcion, tipo, fecha, id_empleado } = req.body;
    const token = req.user;
    const errores = [];

    if (!req.files || req.files.length === 0) errores.push('No se han enviado archivos PDF');
    if (!descripcion) errores.push('El parámetro DESCRIPCIÓN es obligatorio');
    if (!tipo) errores.push('El parámetro TIPO es obligatorio');
    if (!fecha) errores.push('El parámetro FECHA es obligatorio');
    if (!id_empleado) errores.push('El parámetro ID_EMPLEADO es obligatorio');

    if (typeof descripcion !== 'string') errores.push('La DESCRIPCIÓN debe ser un string');
    if (!['F','LSG','LCG','LF','PE','LP'].includes(tipo)) errores.push('El TIPO debe ser [F, LSG, LCG, LF, PE, LP]');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.push('El formato para FECHA INICIO es incorrecto, debe ser YYYY-MM-HH)');
    if (isNaN(id_empleado)) errores.push('El ID_EMPLEADO debe ser un entero');

    if (errores.length > 0) {
        for (const file of req.files) await deleteFile(file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
        const asistencia = await getIdsAsistenciaRango(id_empleado, fecha, fecha);
        if (!asistencia) {
            errores.push(`No se obtuvo la asistencia para este dia...`);
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'Se encontraron los siguientes errores....',
                data: errores
            });
        }

        // Guardar la ruta de los PDFs :
        const documentos = req.files.map((file) => `uploads/pdfs/${file.filename}`);
        const estado = asistencia.info[0].estado;

        // Formato de envío de errores en caso no haya asistencias o los estados no sean 'A' o 'F' :
        if (!['A','F'].includes(estado)) {
            errores.push('Solo se pueden modificar asistencias o faltas...');
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'Se encontraron los siguientes errores...',
                data: errores,
            });
        }

        if (estado === 'A' && tipo !== 'F') errores.push('Solo se pueden modificar asistencias por faltas...');
        if (estado === 'F' && tipo === 'F') errores.push('Es absurdo modificar una falta por una falta...');

        // Formato de envío de errores en el tipo de estado :
        if (errores.length > 0){
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'Se encontraron los siguientes errores...',
                data: errores,
            });
        }

        const ids = [];
        ids.push(asistencia.info[0].id);
        const response = await createJustificacion(documentos, descripcion, tipo, fecha, fecha, ids, id_empleado, token);

        if (!response) {
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'No se pudo crear la justificación...',
                data: [],
            });
        }

        if (response === 1) {
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'La justificación ya fue creada...',
                data: [],
            });
        }

        const general = {
            id_empleado: id_empleado,
            documentos: documentos,
            descripcion: descripcion,
            tipo: tipo,
            f_inicio: fecha,
            f_fin: fecha
        };

        const historial = await createHistorial(
            'create',
            'Justificacion',
            'documentos, descripcion, tipo, fecha, id_empleado',
            null,
            `${documentos.length}, ${descripcion}, ${tipo}, ${fecha}, ${id_empleado}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Justificación creada con éxito.',
            data: general,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en createJustificacion...',
            error: error.message,
        });
    }
};

// Handler para crear la justificación de un rango de fechas :
const createJustificacionRangoHandler = async (req, res) => {

    const { descripcion, tipo, f_inicio, f_fin, id_empleado } = req.body;
    const token = req.user;
    const errores = [];

    if (!req.files || req.files.length === 0) errores.push('No se han enviado archivos PDF');
    if (!descripcion) errores.push('El parámetro DESCRIPCIÓN es obligatorio');
    if (!tipo) errores.push('El parámetro TIPO es obligatorio');
    if (!f_inicio) errores.push('El parámetro FECHA INICIO es obligatorio');
    if (!f_fin) errores.push('El parámetro FECHA FIN es obligatorio');
    if (!id_empleado) errores.push('El parámetro ID_EMPLEADO es obligatorio...');

    if (typeof descripcion !== 'string') errores.push('La DESCRIPCIÓN debe ser un string...');
    if (!['F','LSG','LCG','LF','PE','LP'].includes(tipo)) errores.push('El TIPO debe ser [F, LSG, LCG, LF, PE, LP]');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_inicio)) errores.push('El formato para FECHA INICIO es incorrecto, debe ser YYYY-MM-HH)');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_fin)) errores.push('El formato para FECHA FIN es incorrecto, debe ser YYYY-MM-HH');
    if (isNaN(id_empleado)) errores.push('El ID EMPLEADO debe ser un entero');

    // Formato de envío de errores de validaciones :
    if (errores.length > 0) {
        for (const file of req.files) await deleteFile(file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores
        });
    }

    try {
        const datos = await getIdsAsistenciaRango(id_empleado, f_inicio, f_fin);
        if (!datos) {
            errores.push(`No se obtuvieron los ids de asistencia desde ${f_inicio} hasta ${f_fin}`);
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'Se encontraron los siguientes errores....',
                data: errores
            });
        }

        // Guardar la ruta de los PDFs :
        const documentos = req.files.map((file) => `uploads/pdfs/${file.filename}`);

        // Obtener un array del rango de fechas :
        const dates = [];
        let currentDate = new Date(f_inicio);
        while (currentDate <= new Date(f_fin)) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const estados = [];
        const erroneos = [];
        const ids = [];

        for (let i = 0; i < datos.info.length; i++) {
            estados.push(datos.info[i].estado);
            ids.push(datos.info[i].id);
            if (!['A','F'].includes(datos.info[i].estado)) erroneos.push(datos.info[i].estado);
            if (datos.info[i].fecha !== dates[i]) errores.push(`No existe asistencia del ${dates[i]}`);
        }

        if (erroneos.length !== 0) errores.push('Solo se pueden modificar asistencias o faltas...');

        // Formato de envío de errores en caso no haya asistencias o los estados no sean 'A' o 'F' :
        if (errores.length > 0) {
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'Se encontraron los siguientes errores...',
                data: errores,
            });
        }

        const hasA = estados.includes('A');
        const hasF = estados.includes('F');
        const allA = estados.every(estado => estado === 'A');
        const allF = estados.every(estado => estado === 'F');

        // Formato de envío de errores en caso se presente este caso ['A', 'F', 'F'] :
        if (hasA && hasF) {
            errores.push('En este rango se presentan tanto asistencias y faltas');
            errores.push('Se pueden modificar solo faltas o solo asistencias...');
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'Se encontraron los siguientes errores...',
                data: errores,
            });
        }

        if (allA) if (tipo !== 'F') errores.push('Solo se pueden modificar asistencias por faltas...');
        if (allF) if (tipo === 'F') errores.push('Es absurdo modificar una falta por una falta...');

        // Formato de envío de errores en el tipo de estado :
        if (errores.length > 0){
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'Se encontraron los siguientes errores...',
                data: errores,
            });
        }

        const response = await createJustificacion(documentos, descripcion, tipo, f_inicio, f_fin, ids, id_empleado, token);

        if (!response) {
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'No se pudo crear la justificación...',
                data: [],
            });
        }

        if (response === 1) {
            for (const file of req.files) await deleteFile(file.filename);
            return res.status(400).json({
                message: 'La justificación ya fue creada...',
                data: [],
            });
        }

        const general = {
            id_empleado: id_empleado,
            nombres: datos.nombre,
            apellidos: datos.apellido,
            dni: datos.dni,
            documentos: documentos,
            descripcion: descripcion,
            tipo: tipo,
            f_inicio: f_inicio,
            f_fin: f_fin
        };

        const historial = await createHistorial(
            'create',
            'Justificacion',
            'documentos, descripcion, tipo, f_inicio, f_final, id_empleado',
            null,
            `${documentos.length}, ${descripcion}, ${tipo}, ${f_inicio}, ${f_fin}, ${id_empleado}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Justificación creada con éxito.',
            data: general,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en createJustificacion...',
            error: error.message,
        });
    }
};

// Handler para actualizar una justificación :
const updateJustificacionHandler = async (req, res) => {

    const { id } = req.params;
    const { descripcion } = req.body;
    const token = req.user;

    if (!id) return res.status(400).json({ message: 'El parámetro ID es requerido y debe ser un entero' });
    if (!descripcion) return res.status(400).json({ message: 'El parámetro ESTADO debe ser un string' });
    if (isNaN(id)) return res.status(400).json({ message: 'El ID debe ser un entero' });
    if (typeof descripcion !== 'string') return res.status(400).json({ message: 'La descripción debe ser un string' });

    try {
        const previo = await getJustificacionById(id);
        const response = await updateJustificacion(id, { descripcion });

        if (!response) {
            return res.status(400).json({
                message: 'No se pudo actualizar la justificación...',
                data: []
            });
        }

        if (response === 1) {
            return res.status(400).json({
                message: 'Para este ID no hay justificación...',
                data: []
            });
        }

        const historial = await createHistorial(
            'update',
            'Justificacion',
            'descripcion',
            previo.descripcion,
            descripcion,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Justificación actualizada con éxito...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta para actualizar una justificación...',
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
