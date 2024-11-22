const { Historial } = require('../db_connection');
const { getUserByToken } = require('../controllers/usuarioController');

const createHistorial = async (accion, modelo, campo, valor_anterior, valor_nuevo, token) => {
    
    if (!accion) {
        console.warn('No se registró ninguna acción...');
        return false;
    }
    if (!modelo) {
        console.warn('No se registró ningún modelo...');
        return false;
    }
    if (!token) {
        console.warn('No se registró ningún id de usuario...');
        return false;
    }
    const id_usuario = await getUserByToken(token);

    try {
        const response = await Historial.create({ accion, modelo, campo, valor_anterior, valor_nuevo, id_usuario });
        return response || null;
    } catch (error) {
        console.error('Error al crear historial: ', error);
        return false;
    }
};

const getAllHistorial = async (page = 1, limit = 20) => {
    
    const offset = (page - 1) * limit;

    try {
        const response = await Historial.findAndCountAll({ limit, offset })
        return {
            data: response.rows,
            currentPage: page,
            totalCount: response.count,
        };

    } catch (error) {
        console.error('Error al obtener todo el historial: ', error);
        return false;
    }
};

const validateUsuarioHistorial = async (id_usuario) => {
    
    try {
        const response = await Historial.findOne({ where: { id_usuario: id_usuario } });
        return response || null;

    } catch (error) {
        console.error('Error al validar el usuario: ', error);
        return false;
    }
}

const getUsuarioHistorial = async (page = 1, limit = 20, id_usuario) => {
    
    const offset = (page - 1) * limit;

    try {
        const response = await Historial.findAndCountAll({
            where: { id_usuario: id_usuario },
            limit,
            offset
        });
        return {
            data: response.rows,
            currentPage: page,
            totalCount: response.count,
        };

    } catch (error) {
        console.error('Error al obtener todo el historial de un usuario: ', error);
        return false;
    }
};

module.exports = {
    createHistorial,
    getAllHistorial,
    validateUsuarioHistorial,
    getUsuarioHistorial
};