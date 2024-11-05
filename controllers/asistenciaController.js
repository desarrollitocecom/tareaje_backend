const { Asistencia } = require('../db_connection');
const { Empleado } = require('../models/Empleado');

const getAsistenciaById = async (id) => {
    try {
        const asistencia = await asistencia.findOne({
            where: { id },
            include: [{ model: Empleado, as: 'Empleado' }]
        });
        return asistencia;
           
    } catch (error) {
        console.error('Error al obtener la asistencia por ID: ', error);
        return false;
    }
};

const getAsistenciaDiaria = async (page = 1, limit = 20, fecha) => {
    const offset = (page - 1) * limit;
    try {
        const asistencias = await Asistencia.findAndCountAll({
            where: { fecha },
            include: [{ model: Asistencia, as: 'Asistencia' }],
            limit,
            offset
        });
        return {
            total: asistencias.count,
            data: asistencias.rows,
            currentPage: page
        } || null;
    } catch (error) {
        console.error('Error al obtener todos los asistencias:', error);
        throw error;
    }
};

const getAllAsistencias = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const asistencias = await Asistencia.findAndCountAll({
            include: [{ model: Asistencia, as: 'Asistencia' }],
            limit,
            offset
        });
        return {
            total: asistencias.count,
            data: asistencias.rows,
            currentPage: page
        } || null;
    } catch (error) {
        console.error('Error al obtener todos los asistencias:', error);
        throw error;
    }
};

const createAsistencia = async (asistencia) => {
    try {
        const newAsistencia = await Asistencia.create(asistencia);
        return newAsistencia;
    } catch (error) {
        console.error('Error al crear una nueva asistencia:', error);
        throw error;
    }
};

const updateAsistencia = async (id, newEstado) => {
    try {
        const empleado = await Empleado.findOne({ where: { id } });
        
        if (!empleado) {
            console.error('No se encontró el empleado con el ID proporcionado...')
            return false;
        }

        const [numUpdated] = await Asistencia.update(
            { estado: newEstado },
            {
                where: {
                    id_empleado: empleado.id,
                }
            }
        );

        if (numUpdated === 0) {
            console.log('No se encontró asistencia para actualizar o ya está actualizada')
            return false;
        }
        console.log('Estado de asistencia actualizado correctamente');
        return true;

    } catch (error) {
        console.error('Error al actualizar la asistencia: ', error);
        throw error;
    }
};

module.exports = {
    getAsistenciaById,
    getAllAsistencias,
    createAsistencia,
    updateAsistencia
};