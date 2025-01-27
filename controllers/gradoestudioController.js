const { GradoEstudios } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener los grados de estudio con paginación y búsqueda :
const getGradoEstudios = async (page = 1, limit = 20, filters = {}) => {

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

        const { count, rows } = await GradoEstudios.findAndCountAll({
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
            message: 'Error en el controlador al obtener todos los grados de estudio',
            error: error.message
        });
        return false;
    }
}

// Obtener un grado de estudio por ID :
const getGradoEstudio = async (id) => {

    try {
        const response = await GradoEstudios.findOne({
            where: { id, state:true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener un grado de estudio',
            error: error.message
        });
        return false;
    }
};
// Crear un grado de estudio :
const createGradoEstudio = async (nombre) => {

    try {
        const response = await GradoEstudios.create({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear un grado de estudio',
            error: error.message
        });
        return false;
    }
};

// Actualizar un grado de estudio :
const updateGradoEstudio = async (id, nombre) => {

    try {
        const response = await getGradoEstudio(id);
        if (response) await response.update({ nombre });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar un grado de estudio',
            error: error.message
        });
        return false;
    }
};

// Eliminar un grado de estudio (state false) :
const deleteGradoEstudio = async (id) => {

    try {
        const response = await GradoEstudios.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar un grado de estudio',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getGradoEstudios,
    createGradoEstudio,
    getGradoEstudio,
    updateGradoEstudio,
    deleteGradoEstudio
};