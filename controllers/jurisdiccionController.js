const { Jurisdiccion } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener las jurisdicciones con paginación y búsqueda :
const getJurisdicciones = async (page = 1, limit = 20, filters = {}) => {

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

        const { count, rows } = await Jurisdiccion.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: count, data: rows, currentPage: page };

    } catch (error) {
        console.error('Error al obtener todas las jurisdicciones:', error);
        return false
    }
}

//trae una Jurisdiccion especifica por id
const getJurisdiccion = async (id) => {
    try {
        const newJurisdiccion = await Jurisdiccion.findOne({
            where: {
                id,

            }
        });
        return newJurisdiccion || null;
    } catch (error) {
        console.error(`Error al obtener la Jurisdiccion: ${error.message}`);
        return false
    }
};
//Crea una nueva Jurisdiccion
const createJurisdiccion = async ({ nombre }) => {
    try {
        const newJurisdiccion = await Jurisdiccion.create({ nombre });
        return newJurisdiccion
    } catch (error) {
        console.error('Error al crear una nueva Jurisdiccion', error)
        return false
    }
};
//elimina la Jurisdiccion o canbia el estado
const deleteJurisdiccion = async (id) => {
    try {
        const newJurisdiccion = await Jurisdiccion.findByPk(id);
        newJurisdiccion.state = false;
        await newJurisdiccion.save();
        return newJurisdiccion || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Jurisdiccion');
        return false;
    }
};


const updateJurisdiccion = async (id, nuevaJurisdiccion) => {
    if (id && nuevaJurisdiccion)
        try {
            const newJurisdiccion = await Jurisdiccion.findOne({ where: { id } });
            if (newJurisdiccion)
                await newJurisdiccion.update(nuevaJurisdiccion);
            return newJurisdiccion || null;

        } catch (error) {
            console.error('Error al actualizar la Jurisdiccion:', error.message);
            return false;
        }
    else
        return false;
};



module.exports = {
    getJurisdicciones,
    createJurisdiccion,
    getJurisdiccion,
    updateJurisdiccion,
    deleteJurisdiccion
};