const { createUser, getUser, changePassword, signToken, getToken, changeUserData, getAllUsers, getUserById, deleteUser, logoutUser } = require("../controllers/usuarioController");
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { userSockets } = require("../sockets");
const { createHistorial } = require('../controllers/historialController');

const usuarioRegex = /^[a-zA-Z0-9._-]{4,20}$/;
const contraseñaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const idRolRegex = /^[1-9]\d*$/;

const createUserHandler = async (req, res) => {

    const { usuario, contraseña, correo, id_rol, id_empleado } = req.body;
    const token = req.user;
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

    //console.log(errors);
    if (errors.length > 0)
        return res.status(402).json({ message: "Se encontraron los siguientes errores", data: errors });

    try {
        const response = await createUser({
            usuario: usuario,
            contraseña: contraseña,
            correo: correo,
            id_rol: id_rol,
            id_empleado: id_empleado
        });
        if (!response) return res.status(201).json({ message: "Error al crear el usuario", data: response });

        const historial = await createHistorial(
            'create',
            'Usuario',
            'usuario, correo, id_rol, id_empleado',
            null,
            `${usuario}, ${correo}, ${id_rol}, ${id_empleado}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');
        
        return res.status(201).json({ message: "Usuario creado correctamente", data: response });

    } catch (error) {
        console.error("Error en createUser: ", error.message);
        return res.status(500).json({ message: "Error en createUserHandler", error: error.message });
    }
};


const changePasswordHandler = async (req, res) => {

    const { usuario, contraseña, nuevaContraseña } = req.body;
    const token = req.user;

    const errors = [];
    if (!usuario) errors.push("El nombre de usuario es requerido");
    if (!contraseña) errors.push("La contraseña actual es requerida");
    if (!nuevaContraseña) errors.push("La nueva contraseña es requerida");
    else if (!contraseñaRegex.test(nuevaContraseña))
        errors.push("La nueva contraseña debe tener al menos 8 caracteres, incluyendo letras y números");

    if (errors.length > 0) {
        return res.status(400).json({ message: "Se encontraron los siguientes errores", data: errors });
    }

    try {

        const user = await getUser(usuario);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const contraseñaCorrecta = await argon2.verify(user.dataValues.contraseña, contraseña);
        if (!contraseñaCorrecta) {
            return res.status(400).json({ message: "La contraseña actual es incorrecta" });
        }

        if (await argon2.verify(user.dataValues.contraseña, nuevaContraseña)) {
            return res.status(400).json({ message: "La nueva contraseña no puede ser igual a la anterior" });
        }

        const response = await changePassword(usuario, nuevaContraseña);
        if (!response) return res.status(500).json({ message: "Error al cambiar la contraseña" });

        const historial = await createHistorial(
            'update',
            'Usuario',
            'contraseña',
            'PRIVADO',
            'PRIVADO',
            token
        );
        if (!historial) console.warn('No se agregó al historial...');
        
        return res.status(200).json({ message: "Contraseña cambiada correctamente" });

    } catch (error) {
        console.error("Error en changePasswordHandler: ", error.message);
        return res.status(500).json({ message: "Error en changePasswordHandler", error: error.message });
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

        const user = await getUser(usuario);

        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado", data: false });

        const contraseñaValida = await argon2.verify(user.contraseña, contraseña);

        if (!contraseñaValida)
            return res.status(400).json({ message: "Contraseña incorrecta", data: false });

        const token = jwt.sign({ usuario: usuario, rol: user.id_rol }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Verificar si el usuario ya está conectado y forzar logout en otros dispositivos
        const previousSocket = userSockets.get(usuario);
        //console.log("ususario; ",usuario);
        //console.log("previousSocket: ",previousSocket);
        if (previousSocket) {
            previousSocket.emit("forceLogout", { message: "Sesión cerrada en otro dispositivo", data: { usuario: usuario } });
        }

        const sesion = await signToken(usuario, token);
        if (!sesion.token) return res.status(400).json({ message: "Error al iniciar la sesión", data: false });

        const historial = await createHistorial(
            'read',
            'Usuario',
            'Login',
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');
        
        return res.status(200).json({ message: "Sesion iniciada", token, rol: user.id_rol, data: true });

    } catch (error) {
        console.error("error en login: ", error);
        return res.status(500).json({ message: "Error en loginHandler: ", error: error.message });
    }
};

const changeUserDataHandler = async (req, res) => {

    const { usuario, correo, id_rol } = req.body;
    const token = req.user;
    const errors = [];

    if(!usuario)
        errors.push("El nombre de usuario es requerido");
    if (!correo)
        errors.push("El correo es requerido");
    if (!correoRegex.test(correo))
        errors.push("Formato de correo inválido");
    if (!id_rol)
        errors.push("El id de rol es requerido");
    if (!idRolRegex.test(id_rol))
        errors.push("El id de rol debe ser un número entero positivo");
    if (errors.length > 0)
        return res.status(400).json({ message: "Se encontraron los siguientes errores", data: errors });

    try {
        const previo = getUserById(token);
        const response = changeUserData(usuario, correo, id_rol);
        if (!response) return res.status(400).json({ message: "Error al actualizar los datos", data: false });

        const anterior = [previo.correo, previo.id_rol];
        const nuevo = [correo, id_rol];
        const campos = ['correo', 'id_rol'];
        let historial;

        for (let i = 0; i < anterior.length; i++) {
            if (anterior[i] !== nuevo[i]) {
                historial = await createHistorial(
                    'update',
                    'Usuario',
                    campos[i],
                    anterior[i],
                    nuevo[i],
                    token
                );
                if (!historial) console.warn('No se agregó al historial...');
            }
        }

        return res.status(200).json({ message: "Datos actualizados correctamente", data: response });

    } catch (error) {
        console.error("Error en el changeUserDataHandler", error.message);
        return res.status(500).json({ message: "Error en el changeUserDataHandler", error: error.message });
    }

};

const getTokenHandler = async (req, res) => {

    const { usuario } = req.params;

    try {
        const response = await getToken(usuario);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error en getTokenHandler: ", error.message);
        return res.status(500).json({ message: "error en getTokenHandler", error: error.message });
    }

};

// Handler para obtener todos los usuarios con paginación y búsqueda :
const getAllUsersHandler = async (req, res) => {

    const { page = 1, pageSize = 20, search } = req.query;
    const filters = { search };
    const token = req.user;

    const errores = [];
    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(pageSize)) errores.push("El pageSize debe ser un numero");
    if (pageSize <= 0) errores.push("El pageSize debe ser mayor a 0 ");
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const users = await getAllUsers(page, pageSize, filters);
        const totalPages = Math.ceil(users.totalCount / pageSize);

        // Verificar si la página solicitada está fuera de rango
        if (page > totalPages) {
            return res.status(200).json({
                message: "Página fuera de rango",
                data: {
                    data: [],
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: users.totalCount,
                }
            });
        }

        const historial = await createHistorial(
            'read',
            'Usuario',
            'Read All Users',
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: "Usuarios obtenidos correctamente",
            data: {
                data: users.data,
                currentPage: page,
                totalPages: totalPages,
                totalCount: users.totalCount,
            }
        });
    } catch (error) {
        console.error("Error en getAllUsersHandler:", error.message);
        return res.status(500).json({
            message: "Error en getAllUsersHandler",
            data: error.message
        });
    }
};

const getUserByIdHandler = async (req, res) => {

    //const { token } = req.body;
    const token = req.headers.authorization.split("___")[1];
    
    try {
        const user = await getUserById(token);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado", data: false });

        const historial = await createHistorial(
            'read',
            'Usuario',
            'Read User Id',
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({ message: "Usuario encontrado", data: user });
    }
    catch (error) {
        console.error("Error en getUserByIdHandler: ", error.message);
        return res.status(500).json({ message: "Error en getUserByIdHandler", data: error.message });
    }
};

const deleteUserHandler = async (req, res) => {

    const { usuario } = req.params;
    const token = req.user;

    try {
        const user = await deleteUser(usuario);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado", data: false });

        const historial = await createHistorial(
            'delete',
            'Usuario',
            'usuario, correo, id_rol, id_empleado',
            `${user.usuario}, ${user.correo}, ${user.id_rol}, ${user.id_empleado}`,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        // const response = await user.update({ state: false });
        return res.status(200).json({ message: "Usuario eliminado correctamente", data: response });

    } catch (error) {
        console.error("Error en deleteUserHandler: ", error.message);
        return res.status(500).json({ message: "Error en deleteUserHandler", data: error.message });
    }
};


const logoutHandler = async (req, res) => {

    const authHeader = req.headers.authorization; 
    const token = authHeader.split(" ")[1];
  
    let usuario;
    try {
      usuario = jwt.verify(token, process.env.JWT_SECRET).usuario;
    } catch (error) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  
    if (!usuario) {
      return res.status(400).json({ message: "El nombre de usuario es requerido para cerrar sesión" });
    }
  
    try {
      const result = await logoutUser(usuario);
      if (!result) return res.status(404).json({ message: "Usuario no encontrado" });
  
      // Emitir evento de logout si el usuario está conectado
      const socket = userSockets.get(usuario);
      if (socket) {
        socket.emit("logout", { message: "Sesión cerrada", usuario });
        userSockets.delete(usuario);
      }
  
      res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
      console.error("Error en logoutHandler:", error.message);
      res.status(500).json({ message: "Error al cerrar sesión", error: error.message });
    }

  };


module.exports = {
    createUserHandler,
    changePasswordHandler,
    loginHandler,
    getTokenHandler,
    changeUserDataHandler,
    getAllUsersHandler,
    getUserByIdHandler,
    deleteUserHandler,
    logoutHandler,
};