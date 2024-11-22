const {
    getJustificacionById,
    getAllJustificaciones,
    validateJustificacion,
    createJustificacion,
    updateJustificacion
} = require('../controllers/justificacionController');

const { getIdsAsistenciaRango } = require('../controllers/asistenciaController')
const { createHistorial } = require('../controllers/historialController');

// Handler para obtener la justificación por ID :
const getJustificacionByIdHandler = async (req,res) => {
    
    const { id } = req.params;
    const token = req.user;

    if (!id) return res.status(400).json({ message: 'El parámetro ID es requerido' });
    if (isNaN(id)) return res.status(400).json({ message: 'El parámetro ID debe ser un entero' });

    try {
        const justificacion = await getJustificacionById(id);
        if(!justificacion){
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

    // Validaciones para la obtención de las justificaciones :
    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page <= 0) errores.push('El page debe ser un entero mayor a cero');
    if (isNaN(limit)) errores.push('El limit debe ser un entero');
    if (limit <= 0) errores.push('El limit debe ser un entero mayor a cero');
    if(errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await getAllJustificaciones(Number(page), Number(limit));
        if(response.length === 0 || page > limit){
            return res.status(200).json({ 
                message: 'No hay más justificaciones por mostrar...',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
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
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta para obtener las justificaciones...',
            error: error.message
        });
    }
};

// Handler para crear una justificación (A --> F o F --> A) :
const createJustificacionHandler = async (req, res) => {

    const { descripcion, id_asistencia, id_empleado } = req.body;
    const token = req.user;

    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No se han enviado archivos PDF' });
    if (!descripcion) return res.status(400).json({ message: 'El parámetro DESCRIPCIÓN es obligatorio' });
    if (!id_asistencia) return res.status(400).json({ message: 'El parámetro ID_ASISTENCIA es obligatorio' });
    if (!id_empleado) return res.status(400).json({ message: 'El parámetro ID_EMPLEADO es obligatorio' });
    if (typeof descripcion !== 'string') return res.status(400).json({ message: 'La DESCRIPCIÓN debe ser un string' });
    if (typeof id_asistencia !== 'string') return res.status(400).json({ message: 'El ID_ASISTENCIA debe ser un string' });
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id_asistencia)) {
        return res.status(400).json({ message: 'El ID_ASISTENCIA debe ser de tipo UUID' });
    }
    if (isNaN(id_empleado)) return res.status(400).json({ message: 'El ID_EMPLEADO debe ser un entero' });

    try {
        const estado = await validateJustificacion(id_asistencia);
        if (!estado){
            return res.status(400).json({
                message: 'No existe este ID de asistencia...',
                data: []
            })
        }

        if (estado === 1){
            return res.status(400).json({
                message: 'Solo se pueden actualizar asistencias o faltas...',
                data: []
            })
        }

        // Guardar las rutas de los PDFs :
        const documentos = req.files.map((file) => `uploads/pdfs/${file.filename}`);

        const response = await createJustificacion(documentos, descripcion, id_asistencia, id_empleado, estado, token);
        if (!response){
            return res.status(400).json({
                message: 'No se pudo crear la justificación...',
                data: []
            });
        }

        const historial = await createHistorial(
            'create',
            'Justificacion',
            'documentos, descripcion, id_asistencia, id_empleado',
            null,
            `${documentos.length}, ${descripcion}, ${id_asistencia}, ${id_empleado}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Justificación creada con éxito.',
            data: response,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en createJustificacion...',
            error: error.message,
        });
    }
};

// Handler para crear una justificación (A --> F o F --> A) :
const createJustificacionRangoHandler = async (req, res) => {

    const { f_inicio, f_fin, descripcion, id_empleado } = req.body;
    const token = req.user;
    const errores = [];

    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No se han enviado archivos PDF' });
    if (!f_inicio) errores.push('La fecha de inicio es obligatoria...');
    if (!f_fin) errores.push('La fecha de fin es obligatoria...');
    if (!descripcion) errores.push('El parámetro DESCRIPCIÓN es obligatorio...')
    if (!id_empleado) errores.push('El parámetro ID_EMPLEADO es obligatorio...')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_inicio)) errores.push('El formato para INICIO es incorrecto, debe ser YYYY-MM-HH)');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f_fin)) errores.push('El formato para FIN es incorrecto, debe ser YYYY-MM-HH');
    if (typeof descripcion !== 'string') errores.push('La DESCRIPCIÓN debe ser un string...');
    if (isNaN(id_empleado)) errores.push('El ID_EMPLEADO debe ser un entero');
    if(errores.length > 0) return res.status(400).json({ errores });

    try {
        const datos = await getIdsAsistenciaRango(id_empleado, f_inicio, f_fin);
        if (!datos) {
            return res.status(400).json({
                message: 'No se obtuvo los ids de las asistencias...',
                data: []
            });
        }

        // Guardar las rutas de los PDFs :
        const documentos = req.files.map((file) => `uploads/pdfs/${file.filename}`);

        for (let i = 0; i < datos.ids.length; i++) {
            
            const estado = await validateJustificacion(datos.ids[i]);
            if (!estado) {
                return res.status(400).json({
                    message: 'No se hizo el cambio de estado para este ID...',
                    data: []
                });
            }

            const response = await createJustificacion(documentos, descripcion, datos.ids[i], id_empleado, estado, token);
            if (!response) {
                return res.status(400).json({
                    message: 'No se pudo crear la justificación...',
                    data: []
                });
            }
        }

        const general = {
            id_empleado: id_empleado,
            nombres: datos.nombre,
            apellidos: datos.apellido,
            dni: datos.dni,
            documentos: documentos,
            descripcion: descripcion,
            f_inicio: f_inicio,
            f_fin: f_fin
        };

        const historial = await createHistorial(
            'create',
            'Justificacion',
            'documentos, descripcion, f_inicio, f_final, id_empleado',
            null,
            `${documentos.length}, ${descripcion}, ${f_inicio}, ${f_fin}, ${id_empleado}`,
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
    updateJustificacionHandler,
};
