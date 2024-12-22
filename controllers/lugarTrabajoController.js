const { LugarTrabajo } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener los lugares de trabajo con paginación y búsqueda :
const getLugarTrabajos = async (page = 1, limit = 20, filters = {}) => {

    const { search } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        const whereCondition = {
            state: true,
            ...(search && {
                [Op.or]: [{ nombre: { [Op.iLike]: `%${search}%` }}]
            })
        };
        
        const { count, rows } = await LugarTrabajo.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: count, data: rows, currentPage: page } || null;

    } catch (error) {
        console.error('Error al obtener los lugares de trabajo:', error);
        return false
    }
}

// Obtener un Lugar de Trabajo específico por id :
const getLugarTrabajo = async (id) => {

    try {
        const response = await LugarTrabajo.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error(`Error al obtener la Función: ${error.message}`);
        return false
    }
};

// Crear un nuevo Lugar de Trabajo
const createLugarTrabajo = async ({ nombre }) => {
    try {
        const lugarTrabajo = await LugarTrabajo.create({ nombre });
        return lugarTrabajo

    } catch (error) {
        console.error('Error al crear una nueva LugarTrabajo', error)
        return false
    }
};

// Eliminar la LugarTrabajo o canbia el estado
const deleteLugarTrabajo = async (id) => {
    try {
        const lugarTrabajo = await LugarTrabajo.findByPk(id);
        lugarTrabajo.state = false;
        await lugarTrabajo.save();
        return lugarTrabajo || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar LugarTrabajo');
        return false;
    }
};


const updateLugarTrabajo = async (id, nuevaLugarTrabajo) => {
    if (id && nuevaLugarTrabajo)
        try {
            const lugarTrabajo = await LugarTrabajo.findOne({ where: { id } });
            if (lugarTrabajo)
                await lugarTrabajo.update(nuevaLugarTrabajo);
            return lugarTrabajo || null;


        } catch (error) {
            console.error('Error al actualizar la LugarTrabajo:', error.message);
            return false;
        }
    else
        return false;
};



module.exports = {
    getLugarTrabajos,
    createLugarTrabajo,
    getLugarTrabajo,
    updateLugarTrabajo,
    deleteLugarTrabajo
};