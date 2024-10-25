const LugarTrabajo = require('../models/lugarTrabajo');
const { sequelize } = require('../db_connection');
const { Op } = require('sequelize');
//Crea una nuevo lugarTrabajo
const createlugarTrabajo = async ({ nombre }) => {
    try {
        const lugarTrabajo = await LugarTrabajo(sequelize).create({ nombre });
        return lugarTrabajo;

    } catch (error) {
        console.log(error);
        throw new Error('Error al crear lugarTrabajo');
    }
};
//leer lugarTrabajo
const readlugarTrabajo = async (nombrelugarTrabajo) => {
    try {

        const lugarTrabajo = await LugarTrabajo(sequelize).findAll({
            where: {
                nombre: { [Op.iRegexp]: `^${nombrelugarTrabajo}` },
            }
        });

        if (!lugarTrabajo) {
            throw new Error('lugarTrabajo no encontrada');
        }
        return lugarTrabajo;
    } catch (error) {
        throw new Error(`Error al obtener el lugarTrabajo: ${error.message}`)
    }
};

const deletelugarTrabajo = async (id) => {
    try {
        const lugarTrabajo = await LugarTrabajo(sequelize).findByPk(id);

        if (!lugarTrabajo) {
            throw new Error('lugarTrabajo no encontrada');
        }


        lugarTrabajo.state = false;
        await lugarTrabajo.save();

    } catch (error) {
        throw new Error(`Error al eliminar su lugarTrabajo: ${error.message}`);
    }
};


const UpdatelugarTrabajo = async (id, nuevolugarTrabajo) => {
    try {

        const lugarTrabajo = await LugarTrabajo(sequelize).findByPk(id);

        // Verificar si la función existe
        if (!lugarTrabajo) {
            throw new Error('lugarTrabajo no encontrada');
        }

        // Cambiar el nombre
        lugarTrabajo.nombre = nuevolugarTrabajo;

        // Guardar los cambios en la base de datos
        await lugarTrabajo.save();

        return lugarTrabajo; // Retornar la función modificada
    } catch (error) {
        throw new Error(`Error al modificar la lugarTrabajo: ${error.message}`);
    }
};


module.exports = {
    createlugarTrabajo,
    readlugarTrabajo,
    UpdatelugarTrabajo,
    deletelugarTrabajo
};