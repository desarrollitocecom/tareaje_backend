const Usuario = require("../models/Usuario");
const sequelize = require("../db_connection");

const createUser = async (usuario, contraseña, correo) => {

    if (usuario && contraseña && correo)
        try {
            const response = await Usuario(sequelize).create(
                {
                    usuario: usuario,
                    contraseña: contraseña,
                    correo: correo
                }
            );
            return response || null;
        } catch (error) {
            console.error("error en createUser: ", error.message)
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
            if(response)
        } catch (error) {
            console.error("error en updateUser: ", error.message)
            return false;
        }
}


const login = async (username) => {


};