const { RangoHorario, Turno, Cargo } = require('../db_connection');

// Obtener un RangoHorario por ID con su Turno
const getRangoHorarioById = async (id) => {
    try {
        const rangoHorario = await RangoHorario.findOne({
            where: { id },
            include: [
                { model: Cargo, as: 'Cargo' },
                { model: Turno, as: 'Turno' }
            ]
        });
        return rangoHorario;
    } catch (error) {
        console.error('Error al obtener el rango horario por ID:', error);
        return false;
    }
};

// Obtener todos los RangosHorario con sus Turnos (con paginación)
const getAllRangosHorarios = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const rangosHorarios = await RangoHorario.findAndCountAll({
            where: { state: true },
            include: [
                { model: Cargo, as: 'Cargo' },
                { model: Turno, as: 'Turno' }
            ],
            limit,
            offset
        });
        return {
            totalCount: rangosHorarios.count,
            data: rangosHorarios.rows,
            currentPage: page
        } || null;
    } catch (error) {
        console.error('Error al obtener todos los rangos horarios:', error);
        return false;
    }
};

// Crear un nuevo RangoHorario
const createRangoHorario = async (rangoHorarioData) => {
    try {
        const newRangoHorario = await RangoHorario.create(rangoHorarioData);
        return newRangoHorario;
    } catch (error) {
        console.error('Error al crear un nuevo rango horario:', error);
        return false;
    }
};

// Actualizar un RangoHorario
const updateRangoHorario = async (id, rangoHorarioData) => {
    try {
        const rangoHorario = await RangoHorario.findByPk(id);
        if (!rangoHorario) {
            return null; // Si el rango horario no existe, retorna null
        }
        await rangoHorario.update(rangoHorarioData);
        return rangoHorario;
    } catch (error) {
        console.error('Error al actualizar el rango horario:', error);
        return false;
    }
};

// Eliminar un RangoHorario (cambiar state a false)
const deleteRangoHorario = async (id) => {
    try {
        const rangoHorario = await RangoHorario.findByPk(id);
        if (!rangoHorario) {
            return null; // Si el rango horario no existe, retorna null
        }
        // Cambia el estado a false en lugar de eliminar
        rangoHorario.state = false;
        await rangoHorario.save();
        return rangoHorario;
    } catch (error) {
        console.error('Error al eliminar el rango horario:', error);
        throw error;
    }
};

module.exports = {
    getRangoHorarioById,
    getAllRangosHorarios,
    createRangoHorario,
    updateRangoHorario,
    deleteRangoHorario
};
