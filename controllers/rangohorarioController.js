const { RangoHorario, Turno, Subgerencia } = require('../db_connection');
const { Sequelize, Op } = require('sequelize');

// Obtener un Rango Horario por ID :
const getRangoHorarioById = async (id) => {

    try {
        const rango = await RangoHorario.findByPk(id);
        return rango || null;

    } catch (error) {
        console.error('Error al obtener el Rango Horario por ID:', error);
        return false;
    }
};

// Obtener un Rango Horario por ID de función :
const getRangoHorarioByFuncion = async (id_funcion) => {
    
    try {
        const response = await RangoHorario.findOne({
            where: {
                state: true,
                ids_funcion: { [Op.contains]: [id_funcion] }
            },
            raw: true
        })
        return response || null;

    } catch (error) {
        console.error('Error al obtener el horario por el id de función');
        return false;
    }
}

// Obtener los Rangos de Horario con paginación y búsqueda :
const getAllRangosHorarios = async (page = 1, limit = 20, filters = {}) => {

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

        const includeCondition = [
            { model: Turno, as: 'turno', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] }
            
        ];

        const { count, rows } = await RangoHorario.findAndCountAll({
            where: whereCondition,
            include: includeCondition,
            order: [['nombre', 'ASC']],
            limit,
            offset,
        });

        return { data: rows, totalCount: count } || null;

    } catch (error) {
        console.error('Error al obtener todos los rangos de horario:', error);
        return false;
    }
};

// Obtener todos los Rangos de Horario para el algoritmo (SIN HANDLER) :
const getRangosHorariosHora = async (hora) => {

    try {
        const horaStr = (hora < 10) ? `0${hora}:00:00` : `${hora}:00:00`;
        const response = await RangoHorario.findAll({
            where: {
                state: true,
                inicio: horaStr,
            },
            attributes: ['ids_funcion', 'id_turno'],
            raw: true
        });
        if(!response || response.length === 0) return [];
        const result = {
            ids_funcion: response.flatMap(item => item.ids_funcion),
            id_turno: response[0].id_turno,
        };
        return result;

    } catch (error) {
        console.error('Error al obtener los rangos de horario por hora:', error);
        return false;
    }
};

// Obtener todas las areas que estén presentes en los Rangos de Horario :
const getAreaRangoHorario = async () => {
    
    try {
        const rango = await RangoHorario.findAll({
            where: { state: true },
            attributes: ['nombre'],
            raw: true
        });
        if (!rango || rango.length === 0) return null;
        const general = new Set();
        rango.forEach(e => general.add(e.nombre));
        return Array.from(general);

    } catch (error) {
        console.error('Error al obtener las areas de los horarios');
        return false;
    }
};

// Crear un nuevo RangoHorario :
const createRangoHorario = async (nombre, inicio, fin, ids_funcion, id_turno, id_subgerencia) => {

    try {
        const response = await RangoHorario.create({
            nombre,
            inicio,
            fin,
            ids_funcion,
            id_turno,
            id_subgerencia
        });
        return response || null;

    } catch (error) {
        console.error('Error al crear un nuevo rango de horario:', error);
        return false;
    }
};

// Actualizar un Rango Horario
const updateRangoHorario = async (id, nombre, inicio, fin, ids_funcion, id_turno, id_subgerencia) => {

    try {
        const rango = await RangoHorario.findByPk(id);
        if (!rango) return 1;

        const response = await rango.update({
            nombre,
            inicio,
            fin,
            ids_funcion,
            id_turno,
            id_subgerencia
        });
        return response || null;

    } catch (error) {
        console.error('Error al actualizar el rango de horario:', error);
        return false;
    }
};

// Añadir un id de función a un rango de horario determinado :
const updateFuncionRangoHorario = async (tipo, id_subgerencia, id_funcion) => {
    
    try {
        const result = await RangoHorario.update(
            { ids_funcion: Sequelize.fn('array_append', Sequelize.col('ids_funcion'), id_funcion) },
            { where: { state: true, nombre: tipo, id_subgerencia: id_subgerencia }}
        );
        return result || null;

    } catch (error) {
        console.error('Error al añadir función a un rango de horario:', error);
        return false;
    }
};

// Eliminar un Rango Horario (Cambio del state a false)
const deleteRangoHorario = async (id) => {

    try {
        const rango = await RangoHorario.findByPk(id);
        if (!rango) return 1;
        
        rango.state = false;
        await rango.save();
        return rango || null;

    } catch (error) {
        console.error('Error al eliminar el Rango Horario:', error);
        return false
    }
};

// Eliminar un id de función a un rango de horario determinado :
const deleteFuncionRangoHorario = async (id_funcion) => {
    
    try {
        const result = await RangoHorario.update(
            { ids_funcion: Sequelize.fn('array_remove', Sequelize.col('ids_funcion'), id_funcion) },
            { where: { state: true }}
        );
        return result || null;

    } catch (error) {
        console.error('Error al eliminar función de un rango de horario:', error);
        return false;
    }
};

module.exports = {
    getRangoHorarioById,
    getRangoHorarioByFuncion,
    getAllRangosHorarios,
    getRangosHorariosHora,
    getAreaRangoHorario,
    createRangoHorario,
    updateRangoHorario,
    updateFuncionRangoHorario,
    deleteRangoHorario,
    deleteFuncionRangoHorario
};
