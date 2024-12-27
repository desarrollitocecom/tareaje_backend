const { Funcion } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener las funciones con paginación y búsqueda :
const getFunciones = async (page = 1, limit = 20, filters = {}) => {

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

        const { count, rows } = await Funcion.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: count, data: rows, currentPage: page } || null;

    } catch (error) {
        console.error('Error al obtener todas las funciones:', error);
        return false;
    }
};

// Obtener una función específica por ID :
const getFuncion = async (id) => {

    try {
        const funcion = await Funcion.findOne({
            where: { id },
            raw: true
        });
        return funcion || null;

    } catch (error) {
        console.error(`Error al obtener la Función: ${error.message}`);
        return false
    }
};

// Crear una nueva función :
const createFuncion = async (nombre) => {

    try {
        const funcion = await Funcion.create({ nombre });
        return funcion

    } catch (error) {
        console.error('Error al crear una nueva Funcion', error)
        return false
    }
};

// Actualizar una función :
const updateFuncion = async (id, nombre) => {

    try {
        const funcion = await getFuncion(id);
        if (funcion) await funcion.update({ nombre: nombre });
        return funcion || null;

    } catch (error) {
        console.error('Error al actualizar la funcion:', error.message);
        return false;
    }
};

// Eliminar una función o cambiar el state :
const deleteFuncion = async (id) => {

    try {
        const funcion = await Funcion.findByPk(id);
        if (!funcion) return null;
        funcion.state = false;
        await funcion.save();
        return funcion || null;

    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Funcion');
        return false;
    }
};

module.exports = {
    getFunciones,
    getFuncion,
    createFuncion,
    updateFuncion,
    deleteFuncion
};