const { Horario, Subgerencia, Turno, Area } = require('../db_connection');

// Obtener el horario por ID :
const getHorarioById = async (id) => {

    try {
        const rango = await Horario.findOne({
            where: { id, state: true }
        });
        return rango || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el horario por ID',
            error: error.message
        });
        return false;
    }
};

// Obtener los horarios con paginación y filtros :
const getAllHorarios = async (page = 1, limit = 20, filters = {}) => {

    const { subgerencia, turno, area } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        const whereCondition = {
            state: true,
            ...(subgerencia && { id_subgerencia: subgerencia }),
            ...(turno && { id_turno: turno }),
            ...(area && {id_area: area })
        };

        const includeCondition = [
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Turno, as: 'turno', attributes: ['nombre'] },
            { model: Area, as: 'area', attributes: ['nombre'] }
        ];

        const { count, rows } = await RangoHorario.findAndCountAll({
            where: whereCondition,
            include: includeCondition,
            order: [
                ['id_subgerencia', 'ASC'], 
                ['id_turno', 'ASC'], 
                ['id_area', 'ASC']
            ],
            limit,
            offset,
        });

        return {
            data: rows,
            totalCount: count
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los horarios',
            error: error.message
        });
        return false;
    }
};

// Obtener todos los horarios que coincidan con la hora de inicio (ALGORITMO) :
const getHorariosHora = async (hora) => {

    try {
        const horaStr = (hora < 10) ? `0${hora}:00:00` : `${hora}:00:00`;
        const response = await Horario.findAll({
            where: {
                state: true,
                inicio: horaStr,
            },
            attributes: ['id_subgerencia', 'id_turno', 'id_area'],
            raw: true
        });

        if(!response || response.length === 0) return [];
        const result = {
            ids_subgerencia: response.map(item => item.id_subgerencia),
            id_turno: response[0].id_turno,
            ids_area: response.map(item => item.id_area)
        };
        return result;

    } catch (error) {
        console.error('Error en el controlador al obtener los rangos de horario por hora:', error);
        return false;
    }
};

// Crear un horario :
const createHorario = async (inicio, fin, id_subgerencia, id_turno, id_area) => {

    try {
        const response = await Horario.create({ inicio, fin, id_subgerencia, id_turno, id_area });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear el horario',
            error: error.message
        });
        return false;
    }
};

// Actualizar un horario :
const updateHorario = async (id, inicio, fin, id_subgerencia, id_turno, id_area) => {

    try {
        const horario = await Horario.findByPk(id);
        const response = await horario.update({ inicio, fin, id_subgerencia, id_turno, id_area });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar el horario',
            error: error.message
        });
        return false;
    }
};

// Eliminar un horario (Cambio del state a false) :
const deleteHorario = async (id) => {

    try {
        const response = await Horario.findOne({
            where: { id, state: true}
        });
        if (!response) return null;

        response.state = false;
        await response.save();
        return response;
    
    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar el horario',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getHorarioById,
    getAllHorarios,
    getHorariosHora,
    createHorario,
    updateHorario,
    deleteHorario
};
