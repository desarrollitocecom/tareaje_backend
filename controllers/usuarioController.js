const {Usuario} = require("../db_connection");
//const { sequelize } = require("../db_connection");

const createUser = async ({usuario, contraseña, correo, id_rol, id_empleado}) => {
     console.log("DATA: ", id_empleado);
    try {
        const response = await Usuario.create(
            {
                usuario: usuario,
                contraseña: contraseña,
                correo: correo,
                token: null,
                id_rol: 1,
                id_empleado: 1
            }
        );
        console.log("contolador");
        console.log("crear usuario: ", response);
        return response || null;
    } catch (error) {
        console.error("error en createUser: ", error)
        return false;
    }
};

const updateUser = async (usuario, contraseña, correo) => {
    if (usuario && contraseña && correo)
        try {
            const response = await Usuario(sequelize).findOne({
                where: {
                    usuario: usuario
                }
            });
            return response || null;
        } catch (error) {
            console.error("error en updateUser: ", error.message)
            return false;
        }
}


const getUser = async (username) => {

    if (username)
        try {
            const response = await Usuario(sequelize).findOne({
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
        const response = await Usuario(sequelize).findOne({
            where: {
                usuario: usuario
            }
        });
    } catch (error) {

    }

    return token;
}

const getToken = async (usuario) => {

    try {
        const token = await Usuario(sequelize).findOne({
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


module.exports = {
    createUser,
    updateUser,
    getUser,
    getToken,
    signToken
};