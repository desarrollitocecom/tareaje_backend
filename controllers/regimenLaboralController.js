const { RegimenLaboral } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener los regímenes laborales con paginación y búsqueda :
const getRegimenLaborales = async (page = 1, limit = 20, filters = {}) => {

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

        const { count, rows } = await RegimenLaboral.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return {
            totalCount: count,
            data: rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los régimenes laborales',
            error: error.message
        });
        return false;
    }
};

// Obtener un régimen laboral por ID :
const getRegimenLaboral = async (id) => {

    try {
        const response = await RegimenLaboral.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener un regimen laboral por ID',
            error: error.message
        });
        return false;
    }
};

// Crear un régimen laboral :
const createRegimenLaboral = async (nombre) => {

    try {
        const response = await RegimenLaboral.create({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear un régimen laboral',
            error: error.message
        });
        return false;
    }
};

// Actualizar un régimen laboral :
const updateRegimenLaboral = async (id, nombre) => {

    try {
        const response = await RegimenLaboral.findByPk(id);
        if (response) await response.update({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar un régimen laboral',
            error: error.message
        });
        return false;
    }
};

// Eliminar un régimen laboral (state false) :
const deleteRegimenLaboral = async (id) => {

    try {
        const response = await RegimenLaboral.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar un régimen laboral',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getRegimenLaborales,
    createRegimenLaboral,
    getRegimenLaboral,
    updateRegimenLaboral,
    deleteRegimenLaboral
};