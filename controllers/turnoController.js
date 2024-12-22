const { Turno } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener los turnos con paginación y búsqueda :
const getTurnos = async (page = 1, limit = 20, filters = {}) => {

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

        const { count, rows } = await Turno.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['id', 'ASC']]

        });
        return { data: rows, total: count } || null;

    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        return false
    }
};

//trae una Turno especifica por id
const getTurno = async (id) => {
    try {
        const turno = await Turno.findOne({
            where: {
                id,
            }
        });
        return turno || null;
    } catch (error) {
        console.error(`Error al obtener la Turno: ${error.message}`);
        return false
    }
};
//Crea una nueva Turno
const createTurno = async ({ nombre }) => {
    try {
        const newTurno = await Turno.create({ nombre });
        return newTurno
    } catch (error) {
        console.error('Error al crear una nueva Turno', error)
        return false
    }
};
//elimina la Turno o canbia el estado
const deleteTurno = async (id) => {
    try {
        const newTurno = await Turno.findByPk(id);
        newTurno.state = false;
        await newTurno.save();
        return newTurno || null
    } catch (error) {
        return false;
    }
};


const updateTurno = async (id, nuevaTurno) => {
    if (id && nuevaTurno)
        try {
            const newTurno = await getTurno(id);
            if (newTurno)
                await newTurno.update(nuevaTurno);
            return newTurno || null;

        } catch (error) {
            console.error('Error al actualizar la Turno:', error.message);
            return false;
        }
    else
        return false;
};



module.exports = {
    getTurnos,
    createTurno,
    getTurno,
    updateTurno,
    deleteTurno
};