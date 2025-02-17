const { Convocatoria } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener un convocatoria específico por ID :
const getConvocatoria = async (id) => {

    try {
        const response = await Convocatoria.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener una convocatoria por ID',
            error: error.message
        });
        return false
    }
};

// Obtener las convocatorias :
const getAllConvocatorias = async (page = 1, limit = 20, filters = {}) => {

    const { mes, year } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;
    
    try {
        const whereCondition = {
            state: true,
            ...(mes && { mes }),
            ...(year && { year }),
        };

        const { count, rows } = await Convocatoria.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [
                ['year', 'ASC'],
                ['mes', 'ASC'],
                ['numero', 'ASC']
            ]
        });

        return {
            totalCount: count,
            data: rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todas las convocatorias',
            error: error.message
        });
        return false;
    }
};

// Obtener el ID de convocatoria para una fecha determinada :
const getIdConvocatoria = async (fecha) => {
    
    try {
        const response = await Convocatoria.findOne({
            where: {
                [Op.and]: [
                    { f_inicio: { [Op.lte]: fecha } },
                    { f_fin: { [Op.gte]: fecha } }
                ]
            },
            raw: true
        });
        if (!response) return null;
        return response.id;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el ID de convocatoria para una fecha',
            error: error.message
        });
        return false;
    }
};

// Crear una convocatoria :
const createConvocatoria = async (mes, year, numero, f_inicio, f_fin) => {

    try {
        const response = await Convocatoria.create({ mes, year, numero, f_inicio, f_fin });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear una convocatoria',
            error: error.message
        });
        return false;
    }
};

// Actualizar una convocatoria :
const updateConvocatoria = async (id, mes, year, numero, f_inicio, f_fin) => {

    try {
        const response = await Convocatoria.findByPk(id)
        if (response) await response.update({ mes, year, numero, f_inicio, f_fin });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar una convocatoria',
            error: error.message
        });
        return false;
    }
};

// Eliminar una convocatoria :
const deleteConvocatoria = async (id) => {

    try {
        const response = await Convocatoria.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response|| null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar una convocatoria',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getConvocatoria,
    getAllConvocatorias,
    getIdConvocatoria,
    createConvocatoria,
    updateConvocatoria,
    deleteConvocatoria
};