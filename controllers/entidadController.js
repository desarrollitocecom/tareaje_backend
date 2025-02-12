const { Entidad } = require('../db_connection');

// Obtener una entidad específico por ID :
const getEntidad = async (id) => {

    try {
        const response = await Entidad.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener una entidad por ID',
            error: error.message
        });
        return false
    }
};

// Obtener las entidades :
const getAllEntidades = async () => {
    
    try {
        const { count, rows } = await Entidad.findAndCountAll({
            where: { state: true },
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
            message: 'Error en el controlador al obtener todas las entidades',
            error: error.message
        });
        return false;
    }
};

// Crear una entidad :
const createEntidad = async (nombre) => {

    try {
        const response = await Entidad.create({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear una entidad',
            error: error.message
        });
        return false;
    }
};

// Actualizar una entidad :
const updateEntidad = async (id, nombre) => {

    try {
        const response = await Entidad.findByPk(id)
        if (response) await response.update({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar una entidad',
            error: error.message
        });
        return false;
    }
};

// Eliminar una entidad :
const deleteEntidad = async (id) => {

    try {
        const response = await Entidad.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response|| null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar una entidad',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getEntidad,
    getAllEntidades,
    createEntidad,
    updateEntidad,
    deleteEntidad
};