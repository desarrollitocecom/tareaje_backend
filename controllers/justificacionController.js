const { Justificacion } = require('../db_connection');

// Obtener la justificación por ID :
const getJustificacionById = async (id) => {

    try {
        const justificacion = await Justificacion.findByPk(id);
        return justificacion || null;
    } catch (error) {
        console.error('Error al obtener la justificación por ID: ', error);
        return false;
    }
};

// Obtener todas las justificaciones :
const getAllJustificaciones = async (page = 1, limit = 20) => {

    const offset = (page - 1) * limit;
    try {
        const justificaciones = await Justificacion.findAndCountAll({
            limit,
            offset
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

// Crear justificacion :
// >> Tener en cuenta que se creará la justificación una vez el usuario haya verificado que la justificación en cuestión sea VÁLIDA
const createJustificacion = async (documentos, descripcion, id_asistencia, id_empleado) => {

    try {
        const newJustificacion = await Justificacion.create({
            documentos: documentos,
            descripcion: descripcion,
            id_asistencia: id_asistencia,
            id_empleado: id_empleado
        });
        return newJustificacion || null;
    } catch (error) {
        console.error('Error al crear una nueva asistencia:', error);
        return false;
    }
};

// Actualizar justificación: Solo se debe actualizar la DESCRIPCIÓN
const updateJustificacion = async (id, newDescripcion) => {

    try {
        const justificacion = await Justificacion.findByPk(id);
        if (!justificacion) {
            console.error('No se encontró la justificación con el ID proporcionado...');
            return null;
        }
        const response = await Justificacion.update(
            { descripcion: newDescripcion },
            {
                where: { id } // Actualiza desde el ID de la Justificación
            }
        );
        return response || null;

    } catch (error) {
        console.error('Error al actualizar la asistencia: ', error);
        return false;
    }
};

module.exports = {
    getJustificacionById,
    getAllJustificaciones,
    createJustificacion,
    updateJustificacion
};