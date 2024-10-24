const Sexo = require('../models/Sexo');
const { sequelize } = require('../db_connection');
const { Op } = require('sequelize');
//Crea una nueva Sexo
const createSexo = async ({ nombre }) => {
    try {
        const sexo = await Sexo(sequelize).create({ nombre });
        return sexo;

    } catch (error) {
        console.log(error);
        throw new Error('Error al crear Sexo');
    }
};
//leer Sexo
const readSexo = async (nombreSexo) => {
    try {

        const sexo = await Sexo(sequelize).findAll({
            where: {
                nombre: { [Op.iRegexp]: `^${nombreSexo}` },
            }
        });

        if (!sexo) {
            throw new Error('Sexo no encontrada');
        }
        return sexo;
    } catch (error) {
        throw new Error(`Error al obtener el Sexo: ${error.message}`)
    }
};

const deleteSexo = async (id) => {
    try {
        const sexo = await Sexo(sequelize).findByPk(id);

        if (!sexo) {
            throw new Error('Sexo no encontrada');
        }


        sexo.state = false;
        await sexo.save();

    } catch (error) {
        throw new Error(`Error al eliminar su Sexo: ${error.message}`);
    }
};


const UpdateSexo = async (id, nuevoSexo) => {
    try {

        const sexo = await Sexo(sequelize).findByPk(id);

        // Verificar si la función existe
        if (!sexo) {
            throw new Error('Sexo no encontrada');
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