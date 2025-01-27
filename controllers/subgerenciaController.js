const { Subgerencia } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener las subgerencias con paginación y búsqueda :
const getSubgerencias = async (page = 1, limit = 20, filters = {}) => {

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

        const { count, rows } = await Subgerencia.findAndCountAll({
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
            message: 'Error en el controlador al obtener todas las subgerencias:',
            error: error.message
        });
        return false;
    }
};

// Obtener una subgerencia por ID :
const getSubgerencia = async (id) => {

    try {
        const response = await Subgerencia.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener la subgerencia por ID:',
            error: error.message
        });
        return false;
    }
};

// Crear una subgerencia :
const createSubgerencia = async (nombre) => {

    try {
        const response = await Subgerencia.create({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear la subgerencia:',
            error: error.message
        });
        return false;
    }
};

// Actualizar una subgerencia :
const updateSubgerencia = async (id, nombre) => {

    try {
        const response = await Subgerencia.findByPk(id);
        if (response) await response.update({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar la subgerencia:',
            error: error.message
        });
        return false;
    }
};

// Eliminar una subgerencia :
const deleteSubgerencia = async (id) => {

    try {
        const response = await Subgerencia.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar la subgerencia:',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getSubgerencias,
    createSubgerencia,
    getSubgerencia,
    updateSubgerencia,
    deleteSubgerencia
};