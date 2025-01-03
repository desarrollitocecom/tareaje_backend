const { RegimenLaboral } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener los regímenes laborales con paginación y búsqueda :
const getRegimenLaborales = async (page = 1, limit = 20, filters = {}) => {

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

        const { count, rows } = await RegimenLaboral.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: count, data: rows, currentPage: page } || null;

    } catch (error) {
        console.error('Error al Obtener todas los regímenes laborales:', error);
        return false
    }
}

//trae una RegimenLaboral especifica por id
const getRegimenLaboral = async (id) => {
    try {
        const newRegimenLaboral = await RegimenLaboral.findOne({
            where: {
                id,
                state: true
            }
        });
        return newRegimenLaboral || null;
    } catch (error) {
        console.error(`Error al obtener la RegimenLaboral: ${error.message}`);
        return false
    }
};
//Crea una nueva RegimenLaboral
const createRegimenLaboral = async ({ nombre }) => {
    try {
        const newRegimenLaboral = await RegimenLaboral.create({ nombre });
        return newRegimenLaboral
    } catch (error) {
        console.error('Error al crear una nueva RegimenLaboral', error)
        return false
    }
};
//elimina la RegimenLaboral o canbia el estado
const deleteRegimenLaboral = async (id) => {
    try {
        const newRegimenLaboral = await RegimenLaboral.findByPk(id);
        newRegimenLaboral.state = false;
        await newRegimenLaboral.save();
        return newRegimenLaboral || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar RegimenLaboral');
        return false;
    }
};


const updateRegimenLaboral = async (id, nuevoRegimenLaboral) => {
    if (id && nuevoRegimenLaboral)
        try {
            const RegimenLaboral = await getRegimenLaboral(id);
            if (RegimenLaboral)
                await RegimenLaboral.update(nuevoRegimenLaboral);
            return RegimenLaboral || null;

        } catch (error) {
            console.error('Error al actualizar la RegimenLaboral:', error.message);
            return false;
        }
    else
        return false;
};



module.exports = {
    getRegimenLaborales,
    createRegimenLaboral,
    getRegimenLaboral,
    updateRegimenLaboral,
    deleteRegimenLaboral
};