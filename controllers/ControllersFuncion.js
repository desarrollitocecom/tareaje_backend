const Funcion = require('../models/Funcion');
const {sequelize}=require('../db_connection');
//Crea una nueva Funcion
const createFuncion = async ({nombre}) => {
    try {
        const funcion = await Funcion(sequelize).create({ nombre });
        return funcion;

    } catch (error) {
        console.log(error);
        throw new Error('Error al crear Funcion');
    }
};
//
const readFuncion = async (id) => {
    try {
        const funcion = await Funcion.findbyPk(id);
        return funcion;
    } catch (error) {
        throw new Error(`Error al obtener la Funcion: ${error.message}`)
    }
};
const deleteFuncion = async (id) => {
    try {
        const funcion = await Funcion.findByPk(id);
        
        if (!funcion) {
            throw new Error('Función no encontrada');
        }

       
        funcion.state = false;
        await funcion.save();

    } catch (error) {
        throw new Error(`Error al eliminar su Funcion: ${error.message}`);
    }
};


const UpdateFuncion = async (id, nuevoNombre) => {
    try {
        
        const funcion = await Funcion.findByPk(id);

        // Verificar si la función existe
        if (!funcion) {
            throw new Error('Función no encontrada');
        }

        // Cambiar el nombre
        funcion.nombre = nuevoNombre;

        // Guardar los cambios en la base de datos
        await funcion.save();

        return funcion; // Retornar la función modificada
    } catch (error) {
        throw new Error(`Error al modificar la Funcion: ${error.message}`);
    }
};  


module.exports = {
    createFuncion,
    readFuncion,
    UpdateFuncion,
    deleteFuncion
};