const Subgerencia = require('../models/Subgerencia');
const {sequelize}=require('../db_connection');
//Trae todas las Subgerencias
const getSubgerencias=async () => {
    try {
        const response=await Subgerencia(sequelize).findAll({where: {
            state:true  
        }});
        return response || null
    } catch (error) {
        console.error('Error al Obtener todas las Subgerencias',error);
        return false
    }
}

//trae una Subgerencia especifica por id
const getSubgerencia = async (id) => {
    
    
    try {
        const newSubgerencia = await Subgerencia(sequelize).findOne({where: {
            id ,
            state:true
        }});
        console.log(id);
        return newSubgerencia || null;
    } catch (error) {
        console.error(`Error al obtener la Subgerencia: ${error.message}`);
      return false
    }
};
//Crea una nueva Subgerencia
const createSubgerencia = async ({nombre}) => {
    try {
        const newSubgerencia = await Subgerencia(sequelize).create({ nombre });
        return newSubgerencia

    } catch (error) {
        console.error('Error al crear una nueva Subgerencia',error)
        return false
    }
};
//elimina la Subgerencia o canbia el estado
const deleteSubgerencia = async (id) => {
    try {
        const newSubgerencia = await Subgerencia(sequelize).findByPk(id);
        newSubgerencia.state = false;
        await newSubgerencia.save();
       return newSubgerencia || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Subgerencia');
        return false;
    }
};


const updateSubgerencia = async (id, nuevaSubgerencia) => {
    if (id && nuevaSubgerencia)
        try {
            const newSubgerencia = await Subgerencia(sequelize).findOne({ where: { id } });
            if (newSubgerencia) 
                await newSubgerencia.update(nuevaSubgerencia);
                return newSubgerencia || null ;
           
        } catch (error) {
            console.error('Error al actualizar la Subgerencia:', error.message);
            return false;
        }
    else
        return false;
};  



module.exports = {
    getSubgerencias,
    createSubgerencia,
    getSubgerencia,
    updateSubgerencia,
    deleteSubgerencia
};