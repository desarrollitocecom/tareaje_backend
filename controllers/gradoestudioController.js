const { GradoEstudios } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener los grados de estudio con paginación y búsqueda :
const getGradoEstudios = async (page = 1, limit = 20, filters = {}) => {

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

        const { count, rows } = await GradoEstudios.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: count, data: rows, currentPage: page } || null;

    } catch (error) {
        console.error('Error al Obtener todas los Grado Estudios', error);
        return false
    }
}

//trae una GradoEstudio especifica por id
const getGradoEstudio = async (id) => {
    try {
        const GradoEstudio = await GradoEstudios.findOne({
            where: {
                id,
            }
        });
        return GradoEstudio || null;
    } catch (error) {
        console.error(`Error al obtener la Grado de Estudio: ${error.message}`);
        return false
    }
};
//Crea una nueva GradoEstudio
const createGradoEstudio = async ({ nombre }) => {
    try {
        const GradoEstudio = await GradoEstudios.create({ nombre });
        return GradoEstudio
    } catch (error) {
        console.error('Error al crear una nueva Grado de Estudio', error)
        return false
    }
};
//elimina la GradoEstudio o canbia el estado
const deleteGradoEstudio = async (id) => {
    try {
        const GradoEstudio = await GradoEstudios.findByPk(id);
        GradoEstudio.state = false;
        await GradoEstudio.save();
        return GradoEstudio || null
    } catch (error) {
        console.error('Error al cambiar de estado al eliminar Grado de Estudio');
        return false;
    }
};


const updateGradoEstudio = async (id, nuevaGradoEstudio) => {
    if (id && nuevaGradoEstudio)
        try {
            const GradoEstudio = await getGradoEstudio(id);
            if (GradoEstudio)
                await GradoEstudio.update(nuevaGradoEstudio);
            return GradoEstudio || null;

        } catch (error) {
            console.error('Error al actualizar la GradoEstudio:', error.message);
            return false;
        }
    else
        return false;
};



module.exports = {
    getGradoEstudios,
    createGradoEstudio,
    getGradoEstudio,
    updateGradoEstudio,
    deleteGradoEstudio
};