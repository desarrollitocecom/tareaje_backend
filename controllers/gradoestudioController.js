const GradoEstudios = require('../models/GradoEstudios');
const {sequelize}=require('../db_connection');
//Trae todas las GradoEstudioes
const getGradoEstudios=async () => {
    try {
        const response=await GradoEstudios(sequelize).findAll({where: {
            state:true  
        }});
        return response || null
    } catch (error) {
        console.error('Error al Obtener todas los Grado Estudioes',error);
        return false
    }
}

//trae una GradoEstudio especifica por id
const getGradoEstudio = async (id) => {
    try {
        const GradoEstudio = await GradoEstudios(sequelize).findAll({where: {
            id 
        }});
        return GradoEstudio || null;
    } catch (error) {
        console.error(`Error al obtener la Función: ${error.message}`);
      return false
    }
};
//Crea una nueva GradoEstudio
const createGradoEstudio = async ({nombre}) => {
    try {
        const GradoEstudio = await GradoEstudios(sequelize).create({ nombre });
        return GradoEstudio 
    } catch (error) {
        console.error('Error al crear una nueva GradoEstudio',error)
        return false
    }
};
//elimina la GradoEstudio o canbia el estado
const deleteGradoEstudio = async (id) => {
    try {
        const GradoEstudio = await GradoEstudios(sequelize).findByPk(id);
        GradoEstudio.state = false;
        await GradoEstudio.save();
       return GradoEstudio || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar GradoEstudio');
        return false;
    }
};


const updateGradoEstudio = async (id, nuevaGradoEstudio) => {
    if (id && nuevaGradoEstudio)
        try {
            const GradoEstudio = await GradoEstudios(sequelize).findOne({ where: { id } });
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