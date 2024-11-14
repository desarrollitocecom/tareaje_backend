const {
    getJustificacionById,
    getAllJustificaciones,
    createJustificacion,
    updateJustificacion
} = require('../controllers/justificacionController');

// Handler para obtener la justificación por ID :
const getJustificacionByIdHandler = async (req,res) => {
    
    const { id } = req.params;

    // Validaciones para obtener la justificación :
    if (!id) return res.status(400).json({ message: 'El parámetro ID es requerido' });
    if (isNaN(id)) return res.status(400).json({ message: 'El parámetro ID debe ser un entero' });

    try {
        const justificacion = await getJustificacionById(id);
        if(justificacion){
            return res.status(200).json({
                message: 'Justificación obtenida correctamente...',
                data: justificacion
            });
        }
        else{
            return res.status(400).json({
                message: 'La justificación no fue encontrada para este ID...',
                data: null
            });
        }
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

// Handler para la creación de una justificación :
const createJustificacionHandler = async (req, res) => {

    const { documentos, descripcion, id_asistencia, id_empleado } = req.body;

    // Validaciones para la creación de la justificación :
    if (!documentos) return res.status(400).json({ message: 'El parámetro DOCUMENTOS es obligatorio' });
    if (!descripcion) return res.status(400).json({ message: 'El parámetro DESCRIPCION es obligatorio' });
    if (!id_asistencia) return res.status(400).json({ message: 'El parámetro ID ASISTENCIA es obligatorio' });
    if (!id_empleado) return res.status(400).json({ message: 'El parámetro ID EMPLEADO es obligatorio' });
    if (!Array.isArray(documentos)) return res.status(400).json({ message: 'El parámetro DOCUMENTOS debe ser un array' });
    if (documentos.length === 0) return res.status(400).json({ message: 'El array DOCUMENTOS está vacío' });
    if (!documentos.every(e => typeof e === 'string')) {
        return res.status(400).json({ message: 'El array DOCUMENTOS debe tener elementos de tipo string' });
    }
    if (typeof descripcion !== 'string') res.status(400).json({ message: 'La DESCRIPCIÓN debe ser un objeto de tipo string' });
    if (typeof id_asistencia !== 'string') res.status(400).json({ message: 'El ID ASISTENCIA debe ser un objeto de tipo string' });
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id_asistencia)) {
        res.status(400).json({ message: 'El ID ASISTENCIA es necesario que sea de tipo UUID' });
    }
    if (isNaN(id_empleado)) return res.status(400).json({ message: 'El ID EMPLEADO debe ser un entero' });

    try {
        const result = await createJustificacion(documentos, descripcion, id_asistencia, id_empleado);
        if (result) {
            return res.status(200).json({
                message: 'Justificación creada con éxito...',
                success: result
            });
        } else {
            return res.status(400).json({
                message: 'No se pudo crear la justificación...',
                success: result
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta para crear una justificación...',
            error: error.message
        });
    }
}

// Handler para actualizar una justificación :
const updateJustificacionHandler = async (req, res) => {

    const { id } = req.params;
    const { descripcion } = req.body;

    // Validaciones para actualizar una justificación (solo se puede modificar la descripción) :
    if (!id) return res.status(400).json({ message: 'El parámetro ID es requerido y debe ser un entero' });
    if (!descripcion) return res.status(400).json({ message: 'El parámetro ESTADO debe ser un string' });
    if (isNaN(id)) return res.status(400).json({ message: 'El ID debe ser un entero' });
    if (typeof descripcion !== 'string') return res.status(400).json({ message: 'La descripción debe ser un string' });

    try {
        const result = await updateJustificacion(id, descripcion);
        if (result) {
            return res.status(200).json({
                message: 'Justificación actualizada con éxito...',
                success: result
            });
        } else {
            return res.status(400).json({
                message: 'No se pudo actualizar la justificación...',
                success: result
            });
        }
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
    updateJustificacionHandler
};
