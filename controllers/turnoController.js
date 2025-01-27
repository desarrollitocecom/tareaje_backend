const { Turno } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener los turnos con paginación y búsqueda :
const getTurnos = async (page = 1, limit = 20, filters = {}) => {

    const { search } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        const whereCondition = {
            state: true,
            ...(search && {
                [Op.or]: [{ nombre: { [Op.iLike]: `%${search}%` }}]
            })
        };

        const { count, rows } = await Turno.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['nombre', 'ASC']]
        });

        return {
            totalCount: count,
            data: rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todas los turnos:',
            error: error.message
        });
        return false
    }
};

// Obtener un turno por ID :
const getTurno = async (id) => {

    try {
        const response = await Turno.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el turno por ID:',
            error: error.message
        });
        return false
    }
};

// Crear un turno :
const createTurno = async (nombre) => {

    try {
        const response = await Turno.create({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear el turno:',
            error: error.message
        });
        return false;
    }
};

// Acualizar un turno :
const updateTurno = async (id, nombre) => {

    try {
        const response = await Turno.findByPk(id);
        if (response) await response.update({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar el turno:',
            error: error.message
        });
        return false;
    }
};

// Eliminar un turno :
const deleteTurno = async (id) => {

    try {
        const response = await Turno.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar el turno:',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getTurnos,
    createTurno,
    getTurno,
    updateTurno,
    deleteTurno
};