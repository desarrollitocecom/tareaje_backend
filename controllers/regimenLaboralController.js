const RegimenLaboral= require('../models/RegimenLaborals');
const {sequelize}=require('../db_connection');
//Trae todas las RegimenLaborales
const getRegimenLaborales=async () => {
    try {
        const response=await RegimenLaboral(sequelize).findAll({where: {
            state:true  
        }});
        return response || null
    } catch (error) {
        console.error('Error al Obtener todas las RegimenLaborales ',error);
        return false
    }
}

//trae una RegimenLaboral especifica por id
const getRegimenLaboral = async (id) => {
    try {
        const RegimenLaboral = await RegimenLaboral(sequelize).findOne({where: {
            id ,
            state:true
        }});
        return RegimenLaboral || null;
    } catch (error) {
        console.error(`Error al obtener la RegimenLaboral: ${error.message}`);
      return false
    }
};
//Crea una nueva RegimenLaboral
const createRegimenLaboral = async ({nombre}) => {
    try {
        const RegimenLaboral = await RegimenLaboral(sequelize).create({ nombre });
        return RegimenLaboral 
    } catch (error) {
        console.error('Error al crear una nueva RegimenLaboral',error)
        return false
    }
};
//elimina la RegimenLaboral o canbia el estado
const deleteRegimenLaboral = async (id) => {
    try {
        const RegimenLaboral = await RegimenLaboral(sequelize).findByPk(id);
        RegimenLaboral.state = false;
        await RegimenLaboral.save();
       return RegimenLaboral || null
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