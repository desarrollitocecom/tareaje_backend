const { Justificacion, Asistencia, Empleado } = require('../db_connection');
const { Op } = require("sequelize");

const { createHistorial } = require('../controllers/historialController');

// Obtener la justificación por ID :
const getJustificacionById = async (id) => {

    try {
        const response = await Justificacion.findOne({
            where: { id },
            include: [{ model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos', 'dni'] }]
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener la justificación por ID:',
            error: error.message
        });
        return false;
    }
};

// Obtener todas las justificaciones :
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
const createJustificacion = async (documentosPaths, descripcion, tipo, f_inicio, f_fin, ids_asistencia, id_empleado) => {

    try {
        const response = await Justificacion.create({ documentos: documentosPaths, descripcion, tipo, f_inicio, f_fin, id_empleado });
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