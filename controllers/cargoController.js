const { Cargo, Subgerencia } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener un cargo por ID con su subgerencia :
const getCargoById = async (id) => {

    try {
        const cargo = await Cargo.findOne({
            where: { id },
            include: [{ model: Subgerencia, as: 'Subgerencia' }]
        });
        return cargo || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el cargo por ID:',
            error: error.message
        });
    }
};

// Obtener todos los cargos con paginación y búsqueda :
const getAllCargos = async (page = 1, limit = 20, filters = {}) => {

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

        const response = await Cargo.findAndCountAll({
            where: whereCondition,
            include: [{ model: Subgerencia, as: 'Subgerencia' }],
            limit,
            offset,
            order: [['nombre', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el comtrolador al obtener todos los cargos:',
            error: error.message
        });
    }
};

// Crear un nuevo cargo :
const createCargo = async (nombre, sueldo, id_subgerencia) => {

    try {
        const response = await Cargo.create({ nombre, sueldo, id_subgerencia });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear un nuevo cargo:',
            error: error.message
        });
    }
};

// Actualizar un cargo
const updateCargo = async (id, nombre, sueldo, id_subgerencia) => {

    try {
        const response = await Cargo.findByPk(id);
        if (!response) return null;
        await response.update({ nombre, sueldo, id_subgerencia });
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar un cargo:',
            error: error.message
        }); 
    }
};

// Eliminar un cargo (cambiar state a false) :
const deleteCargo = async (id) => {

    try {
        const response = await Cargo.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar un cargo:',
            error: error.message
        });
    }
};

module.exports = {
    getCargoById,
    getAllCargos,
    createCargo,
    updateCargo,
    deleteCargo
};