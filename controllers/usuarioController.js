const { Usuario, Rol, Empleado } = require("../db_connection");


const createUser = async ({ usuario, contraseña, correo, id_rol, id_empleado }) => {

    try {
        const response = await Usuario.create(
            {
                usuario: usuario,
                contraseña: contraseña,
                correo: correo,
                token: null,
                id_rol: id_rol,
                id_empleado: id_empleado
            }
        );
        return response || null;
    } catch (error) {
        console.error("error en createUser: ", error)
        return false;
    }
};

const changePassword = async (usuario, contraseña) => {

    try {
        const user = await getUser(usuario);
        if (user)
            return await user.update({ contraseña: contraseña });
        return null;
    } catch (error) {
        console.error("error en changePassword: ", error.message)
        return false;
    }
}

const getUser = async (username) => {

    if (username)
        try {
            const response = await Usuario.findOne({
                where: {
                    usuario: username
                }
            });
            return response || null;
        } catch (error) {
            console.error("error en getUser: ", error.message)
            return false;
        }
    console.error("Error en getUser: Faltan datos para el getUser");
    return false;

};

const signToken = async (usuario, jwt) => {

    try {
        const user = await getUser(usuario);
        if (user) {
            const updatedUser = await user.update({ token: jwt });
            console.log(updatedUser.dataValues, jwt);
            return updatedUser;
        }
        return null;
    } catch (error) {
        console.error("error en signToken: ", error.message)
        return false;
    }

}

const getToken = async (usuario) => {

    try {
        const token = await Usuario.findOne({
            attributes: ['token'],
            where: {
                usuario: usuario
            }
        });
        return token || null;
    } catch (error) {
        console.error("error en getToken: ", error.message)
        return false;
    }

}

const changeUserData = async (usuario, correo, id_rol) => {

    try {
        const user = await getUser(usuario);
        console.log("usuario: ", user);

        if (user) {
            const updatedUser = await user.update({
                correo: correo !== undefined ? correo : user.correo,
                id_rol: id_rol !== undefined ? id_rol : user.id_rol
            });
            return updatedUser;
        }
        return null;
    } catch (error) {
        console.error("error en changeUserData controller: ", error.message);
        return false;
    }

};

const getAllUsers = async (page = 1, pageSize = 20) => {
    try {

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const response = await Usuario.findAndCountAll({
            attributes: ['id', 'usuario', 'correo', 'state', 'id_rol', 'id_empleado'],
            include: [
                { model: Rol, as: 'rol', attributes: ['nombre'] },
                { model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos'] }
            ],
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
        });
        console.log("response: ", response);
        // Calcula el número total de páginas
        const totalPages = Math.ceil(response.count / pageSize);

        if (response.rows.length > 0)
            return {
                data: response.rows,
                currentPage: page,
                totalPages: totalPages,
                totalCount: response.count,
            };
        return {

        };
    } catch (error) {
        console.error("Error en getAllUsers:", error.message);
        return false;
    }
};

const getUserById = async (id) => {
    try {
        const user = await Usuario.findOne({
            where: { id },
            attributes: ['id', 'usuario', 'correo', 'state', 'id_rol', 'id_empleado'],
            include: [
                { model: Rol, as: 'rol', attributes: ['nombre'] },
                { model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos'] }
            ]
        });

        if (user) {
            return user;
        } else {
            return null; // Retorna null si no se encontró el usuario
        }
    } catch (error) {
        console.error("Error en getUserById:", error.message);
        return false;
    }
};

const deleteUser = async (usuario) => {
    try {
        const user = await Usuario.findOne({ where: { usuario } });
        if (user) {
            const response = await user.update({ state: false });
            return response;
        }
        return null;
    } catch (error) {
        console.error("Error en deleteUser:", error.message);
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
    getUserById,
    deleteUser
};