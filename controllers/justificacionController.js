const { Justificacion, Asistencia, Empleado } = require('../db_connection');
const { Op } = require("sequelize");

// Obtener una justificaión por ID :
const getJustificacion = async (id) => {
    
    try {
        const response = await Justificacion.findOne({
            where: {state: true, id}
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener la justificación por ID:',
            error: error.message
        });
        return false;
    }
}

// Obtener una justificación por ID con atributos del empleados :
const getJustificacionById = async (id) => {

    try {
        const response = await Justificacion.findOne({
            where: { state: true, id },
            include: [{ model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos', 'dni'] }]
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener la justificación por ID con atributos:',
            error: error.message
        });
        return false;
    }
};

// Obtener todas las justificaciones con paginación :
const getAllJustificaciones = async (page = 1, limit = 20) => {

    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        const response = await Justificacion.findAndCountAll({
            limit,
            offset,
            include: [{ model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos', 'dni'] }],
            order: [['f_inicio', 'DESC']]
        });


        return {
            total: response.count,
            data: response.rows,
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todas las justificaciones:',
            error: error.message
        });
        return false;
    }
};

// Validar si una justificación ya existe :
const validateJustificacion = async (id_empleado, f_inicio) => {
    
    try {
        const response = await Justificacion.findOne({
            where: {
                id_empleado: id_empleado,
                f_inicio: { [Op.between]: [f_inicio, f_fin] }
            }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al validar la justificación',
            error: error.message
        })
    }
};

// Crear una justificacion :
const createJustificacion = async (documentosPaths, descripcion, tipo, f_inicio, f_fin, ids_asistencia, id_empleado, estado_inicial = null) => {

    try {
        const response = await Justificacion.create({ documentos: documentosPaths, descripcion, tipo, f_inicio, f_fin, id_empleado, estado_inicial });
        if (!response) return null;

        // Asociar la justificación con las asistencias en la tabla intermedia :
        await response.setAsistencias(ids_asistencia);

        // Actualizamos el estado de la asistencias :
        await Asistencia.update(
            { estado: tipo },
            { where: { id: { [Op.in]: ids_asistencia } } }
        );
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear la justificación:',
            error: error.message
        });
        return false;
    }
};

// Actualizar una justificación:
const updateJustificacion = async (id, documentosPaths, descripcion, tipo, f_inicio, f_fin, ids_asistencia, id_empleado) => {

    try {
        const response = await Justificacion.findByPk(id);
        if (response) await response.update({ documentos: documentosPaths, descripcion, tipo, f_inicio, f_fin, ids_asistencia, id_empleado });
        return response || null;

    } catch (error) {
        console.error('Error en el controlador al actualizar la justificación:', error);
        return false;
    }
};

// Eliminar una justificación :
const deleteJustificacion = async (id) => {
    
    try {
        const response = await response.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response || null;

    } catch (error) {
        console.error('Error al canbiar de estado al eliminar la justificación');
        return false;
    }
};

module.exports = {
    getJustificacion,
    getJustificacionById,
    getAllJustificaciones,
    validateJustificacion,
    createJustificacion,
    updateJustificacion,
    deleteJustificacion
};