const { GradoEstudios } = require('../db_connection');

//Trae todas las GradoEstudioes
const getGradoEstudios = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const { count, rows } = await GradoEstudios.findAndCountAll({
            limit,
            offset
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