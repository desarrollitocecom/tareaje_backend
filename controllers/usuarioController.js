const { Usuario, Rol, Empleado } = require("../db_connection");
const { Op } = require('sequelize');

// Crear un usuario :
const createUser = async ({ usuario, contraseña, correo, id_rol, id_empleado }) => {

    try {
        const response = await Usuario.create({
            usuario: usuario,
            contraseña: contraseña,
            correo: correo,
            token: null,
            id_rol: id_rol,
            id_empleado: id_empleado
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear un usuario',
            error: error.message
        })
        return false;
    }
};

// Cambiar contraseña :
const changePassword = async (usuario, contraseña) => {

    try {
        const user = await getUser(usuario);
        if (user) await user.update({ contraseña: contraseña });
        return user || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al cambiar la contraseña',
            error: error.message
        });
        return false;
    }
};

// Obtener la información de un usuario por su nombre :
const getUser = async (username) => {

    if (!username) {
        console.warn('No se ingresó el nombre del usuario');
        return false;
    }

    try {
        const response = await Usuario.findOne({
            where: { usuario: username }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener la información de un usuario por su nombre',
            error: error.message
        });
        return false;
    }
};

// Asignar un token al usuario:
const signToken = async (usuario, jwt) => {

    try {
        const user = await getUser(usuario);
        if (user)  await user.update({ token: jwt });
        return user || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al asignar un token a un usuario',
            error: error.message
        });
        return false;
    }
};

// Obtener el token del usuario:
const getToken = async (usuario) => {

    try {
        const token = await Usuario.findOne({
            attributes: ['token'],
            where: { usuario: usuario }
        });
        return token || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el token de un usuario',
            error: error.message
        });
        return false;
    }
};

// Cambiar información (correo o rol) de un usuario :
const changeUserData = async (usuario, correo, id_rol) => {

    try {
        const user = await getUser(usuario);
        if (user) await user.update({
            correo: correo !== undefined ? correo : user.correo,
            id_rol: id_rol !== undefined ? id_rol : user.id_rol
        });
        return user || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al cambiar la información un usuario',
            error: error.message
        });
        return false;
    }
};

// Obtener todos los usuarios con paginación y búsqueda :
const getAllUsers = async (page = 1, limit = 20, filters = {}) => {

    const { search } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        const whereCondition = {
            state: true,
            ...(search && {
                [Op.or]: [{ usuario: { [Op.iLike]: `%${search}%` }}]
            })
        };

        const response = await Usuario.findAndCountAll({
            attributes: ['id', 'usuario', 'correo', 'state', 'id_rol', 'id_empleado'],
            where: whereCondition,
            include: [
                { model: Rol, as: 'rol', attributes: ['nombre'] },
                { model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos'] }
            ],
            limit,
            offset,
            order: [['id', 'ASC']],
        });

        return {
            data: response.rows,
            currentPage: page,
            totalCount: response.count
        };
        
    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los usuarios',
            error: error.message
        });
        return false;
    }
};

// Obtener usuario por token :
const getUserByToken = async (token) => {

    try {
        const user = await Usuario.findOne({
            where: { token, token },
            attributes: ['id']
        });
        return user.id;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener un usuario por token',
            error: error.message
        });
        return false;
    }
};

// Obtener un usuario por ID :
const getUserById = async (token) => {

    try {
        const user = await Usuario.findOne({
            where: { token: token },
            attributes: ['id', 'usuario', 'correo', 'state', 'id_rol', 'id_empleado'],
            include: [
                { model: Rol, as: 'rol', attributes: ['nombre'] },
                { model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos','foto'] }
            ]
        });
        return user || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener un usuario por ID',
            error: error.message
        });
        return false;
    }
};

// Eliminar un usuario por nombre :
const deleteUser = async (id) => {

    try {
        const response = await Usuario.findOne({
            where: { state: true, id }
        });
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar un usuario',
            error: error.message
        });
        return false;
    }
};

// Eliminar el token al salir del sistema :
const logoutUser = async (usuario) => {
    try {
        const user = await getUser(usuario);
        if (!user) return false;
        await user.update({ token: null }); // Eliminar el token
        return true;

    } catch (error) {
        console.error({
            message: 'Error en el controlador en el logout',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    createUser,
    changePassword,
    getUser,
    getToken,
    signToken,
    changeUserData,
    getAllUsers,
    getUserByToken,
    getUserById,
    deleteUser,
    logoutUser,
};