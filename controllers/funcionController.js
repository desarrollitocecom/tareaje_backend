const Funcion = require('../models/Funcion');
const {sequelize}=require('../db_connection');
//Trae todas las funciones
const getFunciones=async () => {
    try {
        const response=await Funcion(sequelize).findAll({where: {
            state:true  
        }});
        return response || null
    } catch (error) {
        console.error('Error al Obtener todas las funciones',error);
        return false
    }
}

//trae una funcion especifica por id
const getFuncion = async (id) => {
    try {
        const funcion = await Funcion(sequelize).findAll({where: {
            id 
        }});
        return funcion || null;
    } catch (error) {
        console.error(`Error al obtener la Función: ${error.message}`);
      return false
    }
};
//Crea una nueva Funcion
const createFuncion = async ({nombre}) => {
    try {
        const funcion = await Funcion(sequelize).create({ nombre });
        return funcion

    } catch (error) {
        console.error('Error al crear una nueva Funcion',error)
        return false
    }
};
//elimina la funcion o canbia el estado
const deleteFuncion = async (id) => {
    try {
        const funcion = await Funcion(sequelize).findByPk(id);
        funcion.state = false;
        await funcion.save();
       return funcion || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Funcion');
        return false;
    }
};


const updateFuncion = async (id, nuevaFuncion) => {
    if (id && nuevaFuncion)
        try {
            const funcion = await Funcion(sequelize).findOne({ where: { id } });
            if (funcion) 
                await funcion.update(nuevaFuncion);
                return funcion || null ;
           
        } catch (error) {
            console.error('Error al actualizar la funcion:', error.message);
            return false;
        }
    else
        return false;
};  



module.exports = {
    getFunciones,
    createFuncion,
    getFuncion,
    updateFuncion,
    deleteFuncion
};