const { Area } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener una área determinada : 
const getArea = async (id) => {

    try {
        const response = await Area.findOne({
            where: { state: true, id }
        })
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el área por ID',
            data: error
        });
        return false;
    }
};

// Obtener todas las áreas :
const getAllAreas = async (page = 1, limit = 20, filters = {}) => {

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

        const response = await Area.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
        });

        return {
            totalCount: response.count,
            data: response.rows,
            currentPage: page
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todas las áreas',
            data: error
        });
        return false;
    }
};

// Crear una nueva área :
const createArea = async (nombre) => {

    try {
        const response = await Area.create({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear un área',
            data: error
        });
        return false;
    }
};

// Actualizar una área determinada :
const updateArea = async (id, nombre) => {
    
    try {
        const response = await Area.findByPk(id);
        if (response) await response.update({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar un área',
            data: error
        });
        return false;
    }
};

// Eliminar el área :
const deleteArea = async (id) => {

    try {
        const response = await Area.findOne({
            where: { state: true, id }
        })
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar un área',
            data: error
        });
        return false;
    }
};

module.exports = {
    getArea,
    getAllAreas,
    createArea,
    updateArea,
    deleteArea
};