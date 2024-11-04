const Sexo = require('../models/Sexo');
const {sequelize}=require('../db_connection');
//Crea una nueva Sexo
const createSexo = async ({nombre}) => {
    try {
        const sexo = await Sexo(sequelize).create({ nombre });
        return sexo;

    } catch (error) {
        console.log(error);
        throw new Error('Error al crear Sexo');
    }
};
//leer Sexo
const readSexo = async (id) => {
    try {
        const sexo = await Sexo.findbyPk(id);
        return sexo;
    } catch (error) {
        throw new Error(`Error al obtener la Sexo: ${error.message}`)
    }
};

const deleteSexo = async (id) => {
    try {
        const sexo = await Sexo.findByPk(id);
        
        if (!sexo) {
            throw new Error('Función no encontrada');
        }

         
        sexo.state = false;
        await sexo.save();

    } catch (error) {
        throw new Error(`Error al eliminar su Sexo: ${error.message}`);
    }
};


const UpdateSexo = async (id, nuevoSexo) => {
    try {
        
        const sexo = await Sexo.findByPk(id);

        // Verificar si la función existe
        if (!sexo) {
            throw new Error('Función no encontrada');
        }

        // Cambiar el nombre
        sexo.nombre = nuevoSexo;

        // Guardar los cambios en la base de datos
        await sexo.save();

        return sexo; // Retornar la función modificada
    } catch (error) {
        throw new Error(`Error al modificar la Sexo: ${error.message}`);
    }
};  


module.exports = {
    createSexo,
    readSexo,
    UpdateSexo,
    deleteSexo
};