const { Feriado, FeriadoTipo, Empleado } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener todos los feriados con paginación, búsqueda y filtro :
const getAllFeriados = async (page = 1, limit = 20, filters = {}) => {

    const { search, tipo, inicio, fin } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            state: true,
            ...(search && {
                [Op.or]: [{ nombre: { [Op.iLike]: `%${search}%` }}]
            }),
            ...(tipo && { id_feriado_tipo: tipo }),
            ...(inicio && fin && {
                fecha: { [Op.between]: [inicio, fin] }
            })
        };

        const { count, rows } = await Feriado.findAndCountAll({
            where: whereCondition,
            include: [{ model: FeriadoTipo, as: 'feriadoTipo', attributes: ['nombre'] }],
            limit,
            offset,
            order: [['fecha', 'ASC']]
        });

        return {
            totalCount: count,
            data: rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los feriados:',
            error: error.message
        });
        return false;
    }
};

// Obtener un feriado por ID :
const getFeriado = async (id) => {

    try {
        const response = await Feriado.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el feriado por ID:',
            error: error.message
        });
        return false;
    }
};

// Obtener los tipos de feriado :
const getFeriadoTipos = async () => {
    
    try {
        const response = await FeriadoTipo.findAll();
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener los tipos de feriado:',
            error: error.message
        });
        return false;
    }
};

// Validar si la fecha corresponde a un feriado nacional :
const getFeriadoNacional = async (fecha) => {
    
    try {
        const response = await Feriado.findAll({
            where: { state: true, fecha, id_feriado_tipo: 1 },
            raw: true
        });
        if (!response || response.length === 0) return false;
        return true;
        
    } catch (error) {
        console.error({
            message: 'Error en la validación si la fecha corresponde a un feriado nacional',
            error: error.message
        });
        return false;
    }
};

// Obtener los IDs de los empleados CAS y 728 en un día feriado compensado :
const getFeriadoCompensado = async (fecha) => {
    
    try {
        const response = await Feriado.findAll({
            where: { state: true, fecha, id_feriado_tipo: 2 },
            raw: true
        });
        if (!response || response.length === 0) return [];

        const empleados = await Empleado.findAll({
            where: {
                state: true,
                id_regimen_laboral: { [Op.in]: [2,3,4] }
            },
            attributes: ['id']
        });

        const result = empleados.map(r => r.id);
        return result;
        
    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener los IDs de los empleados CAS y 728 en un día feriado compensado',
            error: error.message
        });
        return false;
    }
};

// Crear un feriado :
const createFeriado = async (nombre, fecha, id_feriado_tipo) => {

    try {
        const response = await Feriado.create({ nombre, fecha, id_feriado_tipo });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear el feriado:',
            error: error.message
        });
        return false;
    }
};

// Actualizar un feriado :
const updateFeriado = async (id, nombre, fecha, id_feriado_tipo) => {

    try {
        const response = await Feriado.findByPk(id);
        if (response) await response.update({ nombre, fecha, id_feriado_tipo });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar el feriado:',
            error: error.message
        });
        return false;
    }
};

// Eliminar un feriado (state false) :
const deleteFeriado = async (id) => {

    try {
        const response = await Feriado.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar el feriado:',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getAllFeriados,
    getFeriado,
    getFeriadoTipos,
    getFeriadoNacional,
    getFeriadoCompensado,
    createFeriado,
    updateFeriado,
    deleteFeriado
};