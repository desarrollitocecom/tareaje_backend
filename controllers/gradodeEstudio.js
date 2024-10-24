const GradodeEstudio = require('../models/GradoEstudios');
const { sequelize } = require('../db_connection');
const { Op } = require('sequelize');
//Crea una nueva gradodeEstudio
const creategradodeEstudio = async ({ nombre }) => {
    try {
        const gradodeEstudio = await GradodeEstudio(sequelize).create({ nombre });
        return gradodeEstudio;

    } catch (error) {
        console.log(error);
        throw new Error('Error al crear Grado de Estudio');
    }
};
//leer gradodeEstudio
const readgradodeEstudio = async (nombregradodeEstudio) => {
    try {

        const gradodeEstudio = await GradodeEstudio(sequelize).findAll({
            where: {
                nombre: { [Op.iRegexp]: `^${nombregradodeEstudio}` },
            }
        });

        if (!gradodeEstudio) {
            throw new Error('gradodeEstudio no encontrada');
        }
        return gradodeEstudio;
    } catch (error) {
        throw new Error(`Error al obtener el gradodeEstudio: ${error.message}`)
    }
};

const deletegradodeEstudio = async (id) => {
    try {
        const gradodeEstudio = await GradodeEstudio(sequelize).findByPk(id);

        if (!gradodeEstudio) {
            throw new Error('gradodeEstudio no encontrada');
        }


        gradodeEstudio.state = false;
        await gradodeEstudio.save();

    } catch (error) {
        throw new Error(`Error al eliminar su gradodeEstudio: ${error.message}`);
    }
};


const UpdategradodeEstudio = async (id, nuevogradodeEstudio) => {
    try {

        const gradodeEstudio = await GradodeEstudio(sequelize).findByPk(id);

        // Verificar si la función existe
        if (!gradodeEstudio) {
            throw new Error('gradodeEstudio no encontrada');
        }

        // Cambiar el nombre
        gradodeEstudio.nombre = nuevogradodeEstudio;

        // Guardar los cambios en la base de datos
        await gradodeEstudio.save();

        return gradodeEstudio; // Retornar la función modificada
    } catch (error) {
        throw new Error(`Error al modificar la gradodeEstudio: ${error.message}`);
    }
};


module.exports = {
    creategradodeEstudio,
    readgradodeEstudio,
    UpdategradodeEstudio,
    deletegradodeEstudio
};