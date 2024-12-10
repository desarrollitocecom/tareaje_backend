const { RangoHorario, Funcion, Turno, Subgerencia } = require('../db_connection');

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

// Obtener todos los Rango Horario con paginación :
const getAllRangosHorarios = async (page = 1, limit = 20) => {

    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {

        const { count, rows } = await RangoHorario.findAndCountAll({
            where: { state: true },
            include: [
                { model: Turno, as: 'turno', attributes: ['nombre'] },
                { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] }
            ],
            limit,
            offset
        });
        return { data: rows, totalCount: count } || null;

    } catch (error) {
        console.error('Error al obtener todos los rangos de horario:', error);
        return false;
    }
};

// Obtener todos los RangosHorario sin paginación (SIN HANDLER) :
const getRangosHorariosHora = async (hora) => {

    try {
        const horaStr = (hora < 10) ? `0${hora}:00:00` : `${hora}:00:00`;

        const response = await RangoHorario.findAll({
            where: {
                state: true,
                inicio: horaStr,
            }
        });

        if (!response) {
            console.warn('No se obtuvo los rangos de horario en esta hora...');
            return null;
        }
        console.log(response);
        return response;

    } catch (error) {
        console.error('Error al obtener los rangos de horario por hora:', error);
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
        console.error('Error al crear un nuevo Rango Horario:', error);
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
        console.error('Error al actualizar el Rango Horario:', error);
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

module.exports = {
    getRangoHorarioById,
    getAllRangosHorarios,
    getRangosHorariosHora,
    createRangoHorario,
    updateRangoHorario,
    deleteRangoHorario
};
