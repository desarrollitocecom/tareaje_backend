const { Distrito } = require('../db_connection');

// Obtener un distrito específico por ID :
const getDistrito = async (id) => {

    try {
        const response = await Distrito.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener un distrito por ID',
            error: error.message
        });
        return false
    }
};

// Obtener los distritos :
const getAllDistritos = async (page = 1, limit = 20) => {

    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;
    
    try {
        const { count, rows } = await Distrito.findAndCountAll({
            where: { state: true },
            limit,
            offset,
            order: [['nombre', 'ASC']],
            raw: true
        });

        return {
            totalCount: count,
            data: rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todas los distritos',
            error: error.message
        });
        return false;
    }
};

// Crear un distrito :
const createDistrito = async (nombre) => {

    try {
        const response = await Distrito.create({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear un distrito',
            error: error.message
        });
        return false;
    }
};

// Actualizar un distrito :
const updateDistrito = async (id, nombre) => {

    try {
        const response = await Distrito.findByPk(id)
        if (response) await response.update({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar un distrito',
            error: error.message
        });
        return false;
    }
};

// Eliminar un distrito :
const deleteDistrito = async (id) => {

    try {
        const response = await Distrito.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response|| null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar un distrito',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getDistrito,
    getAllDistritos,
    createDistrito,
    updateDistrito,
    deleteDistrito
};