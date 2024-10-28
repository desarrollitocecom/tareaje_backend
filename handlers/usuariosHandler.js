const { createUser, getUser, updateUser } = require("../controllers/usuarioController");
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');


const usuarioRegex = /^[a-zA-Z0-9._-]{4,20}$/;
const contraseñaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const idRolRegex = /^[1-9]\d*$/;
const idEmpleadoRegex = /^[1-9]\d*$/;

const createUserHandler = async (req, res) => {
    const { usuario, contraseña, correo, id_rol, id_empleado } = req.body;
    //console.log({ usuario, contraseña, correo, id_rol, id_empleado });
    const errors = [];

    if (!usuario)
        errors.push("El nombre de usuario es requerido");
    else if (!usuarioRegex.test(usuario))
        errors.push("El nombre de usuario debe tener entre 4 y 20 caracteres, y puede incluir letras, números, puntos, guiones bajos o guiones");

    if (!contraseña)
        errors.push("La contraseña es requerida");
    else if (!contraseñaRegex.test(contraseña))
        errors.push("La contraseña debe tener al menos 8 caracteres, incluyendo letras y números");

    if (!correo)
        errors.push("El correo es requerido");
    else if (!correoRegex.test(correo))
        errors.push("Formato de correo inválido");

    console.log(errors);
    if (errors.length > 0) 
        return res.status(402).json({ message: "Se encontraron los siguientes errores", data: errors });

    try {
        //console.log("DATA: ",usuario, contraseña, correo, id_rol, id_empleado);
        const response = await createUser({
            usuario: usuario,
            contraseña: contraseña,
            correo: correo,
            id_rol: id_rol,
            id_empleado: id_empleado
        });
        if (response)
            return res.status(201).json({ message: "Usuario creado correctamente", data: response});
    
            return res.status(201).json({ message: "Error al crear el usuario", data: response});
    } catch (error) {
        console.error("Error en createUser: ", error.message);
        return res.status(500).json({ message: "Error en createUserHandler", error: error.message });
    }
};


const updateUserHandler = async (req, res) => {

    const { usuario, contraseña, correo } = req.body;

        try {
            const response = await Usuario.findOne({
                where: {
                    usuario: usuario
                }
            });
        } catch (error) {
            console.error("error en updateUser: ", error.message)
            return false;
        }
    
};

const loginHandler = async (req, res) => {
    const { usuario, contraseña } = req.body;
    const errors = [];

    if (!usuario)
        errors.push("El nombre de usuario es requerido");
    else if (!usuarioRegex.test(usuario))
        errors.push("El nombre de usuario debe tener entre 4 y 20 caracteres, y puede incluir letras, números, puntos, guiones bajos o guiones");

    if (!contraseña)
        errors.push("La contraseña es requerida");
    else if (!contraseñaRegex.test(contraseña))
        errors.push("La contraseña debe tener al menos 8 caracteres, incluyendo letras y números");
    if (errors.length > 0)
        return res.status(400).json({ message: "Se encontraron los siguientes errores", data: errors });

    try {
        // Busca al usuario en la base de datos
        const user = await getUser(usuario);
        console.log(user);
        if (!user)
            return res.status(201).json({ message: "Usuario no encontrado", data: "asdasd"} );

        const contraseñaValida = await argon2.verify(user.contraseña, contraseña);

        if (!contraseñaValida)
            return res.status(400).json({ message: "Contraseña incorrecta", data: user });

        const token = jwt.sign({ usuario: usuario, rol: user.id_rol }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return res.status(200).json({ message: "Sesion iniciada", token, data: user });
    } catch (error) {
        console.error("error en login: ", error);
        return res.status(500).json({ message: "Error en loginHandler: ", error: error.message });
    }
};



module.exports = {
    createUserHandler,
    updateUserHandler,
    loginHandler
};