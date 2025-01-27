const { LugarTrabajo } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener los lugares de trabajo con paginación y búsqueda :
const getLugarTrabajos = async (page = 1, limit = 20, filters = {}) => {

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
        
        const { count, rows } = await LugarTrabajo.findAndCountAll({
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
            message: 'Error en el controlador al obtener todos los lugares de trabajo',
            error: error.message
        });
        return false;
    }
}

// Obtener un lugar de trabajo por ID :
const getLugarTrabajo = async (id) => {

    try {
        const response = await LugarTrabajo.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener un lugar de trabajo por ID',
            error: error.message
        });
        return false;
    }
};

// Crear un lugar de trabajo :
const createLugarTrabajo = async (nombre) => {

    try {
        const response = await LugarTrabajo.create({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear un lugar de trabajo',
            error: error.message
        });
        return false;
    }
};

// Actualizar un lugar de trabajo :
const updateLugarTrabajo = async (id, nombre) => {

    try {
        const response = await LugarTrabajo.findByPk(id)
        if (response) await response.update({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar un lugar de trabajo',
            error: error.message
        });
        return false;
    }
};

// Eliminar un lugar de trabajo (state false) :
const deleteLugarTrabajo = async (id) => {

    try {
        const response = await LugarTrabajo.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar un lugar de trabajo',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getLugarTrabajos,
    createLugarTrabajo,
    getLugarTrabajo,
    updateLugarTrabajo,
    deleteLugarTrabajo
};