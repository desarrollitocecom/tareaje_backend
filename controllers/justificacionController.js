const { Justificacion, Asistencia, Empleado } = require('../db_connection');
const { createHistorial } = require('../controllers/historialController');

// Obtener la justificación por ID :
const getJustificacionById = async (id) => {

    try {
        const justificacion = await Justificacion.findOne({
            where: { id: id },
            include: [{ model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos', 'dni'] }]
        });
        return justificacion || null;
    } catch (error) {
        console.error('Error al obtener la justificación por ID:', error);
        return false;
    }
};

// Obtener todas las justificaciones :
const getAllJustificaciones = async (page = 1, limit = 20) => {

    const offset = (page - 1) * limit;
    try {
        const justificaciones = await Justificacion.findAndCountAll({
            limit,
            offset,
            include: [{ model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos', 'dni'] }]
        });
        return {
            total: justificaciones.count,
            data: justificaciones.rows,
            currentPage: page
        } || null;
    } catch (error) {
        console.error('Error al obtener todas las justificaciones:', error);
        return false;
    }
};

// Función para validar si es posible la justificación :
const validateJustificacion = async (id_asistencia) => {
    try {
        const response = await Asistencia.findOne(
            { where: { id: id_asistencia }}
        );
        if (!response) return null;
        if (!['A', 'F'].includes(response.estado)) return 1;

        if (response.estado === 'F') return 'A';
        else return 'F';

    } catch (error) {
        console.error('Error al validar la justificación:', error);
        return false;
    }
}

// Crear justificacion :
// >> Tener en cuenta que se creará la justificación una vez se haya verificado que la justificación en cuestión sea VÁLIDA
const createJustificacion = async (documentosPaths, descripcion, id_asistencia, id_empleado, estado, token) => {
    
    try {
        const newJustificacion = await Justificacion.create({
            documentos: documentosPaths,
            descripcion,
            id_asistencia,
            id_empleado,
        });

        if (!newJustificacion) return null
        // Actualizamos el estado de la asistencia :
        await Asistencia.update(
            { estado: estado },
            { where: { id: id_asistencia } }
        );

        const previo = (estado === 'A') ? 'F' : 'A';
        const historial = await createHistorial(
            'update',
            'Asistencia',
            'estado',
            previo,
            estado,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return newJustificacion;

    } catch (error) {
        console.error('Error al crear una nueva justificación:', error);
        return false;
    }
};


// Actualizar justificación: Solo se debe actualizar la DESCRIPCIÓN
const updateJustificacion = async (id, descripcion) => {

    try {
        const justificacion = await Justificacion.findByPk(id);
        if (!justificacion) {
            console.error('No se encontró la justificación con el ID proporcionado...');
            return 1;
        }

        const response = await justificacion.update(descripcion);
        return response || null;

    } catch (error) {
        console.error('Error al actualizar la asistencia:', error);
        return false;
    }
};

module.exports = {
    getJustificacionById,
    getAllJustificaciones,
    validateJustificacion,
    createJustificacion,
    updateJustificacion
};