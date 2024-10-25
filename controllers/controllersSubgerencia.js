const { Subgerencia } = require('../models/Subgerencia');
const {sequelize}=require('../db_connection');

// Crear una subgerencia
const createSubgerencia = async (data) => {
    return await Subgerencia.create(data);
};

// Obtener todas las subgerencias
const getAllSubgerencias = async () => {
    return await Subgerencia.findAll();
};

// Obtener una subgerencia por ID
const getSubgerenciaById = async (id) => {
    return await Subgerencia.findByPk(id);
};

// Actualizar una subgerencia
const updateSubgerencia = async (id, data) => {
    const subgerencia = await Subgerencia.findByPk(id);
    if (!subgerencia) {
        return null;
    }
    return await subgerencia.update(data);
};

// Eliminar una subgerencia
const deleteSubgerencia = async (id) => {
    const subgerencia = await Subgerencia.findByPk(id);
    if (!subgerencia) {
        return null;
    }
    await subgerencia.destroy();
    return subgerencia;
};

module.exports = {
    createSubgerencia,
    getAllSubgerencias,
    getSubgerenciaById,
    updateSubgerencia,
    deleteSubgerencia,
};
