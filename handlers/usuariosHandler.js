const { 
    createUser,
    getUser,
    changePassword,
    signToken,
    getToken,
    changeUserData,
    getAllUsers,
    getUserById,
    deleteUser,
    logoutUser
} = require("../controllers/usuarioController");

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { userSockets } = require("../sockets");
const { createHistorial } = require('../controllers/historialController');

const usuarioRegex = /^[a-zA-Z0-9._-]{4,20}$/;
const contraseñaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const idRolRegex = /^[1-9]\d*$/;

// Handler para crear un usuario :
const createUserHandler = async (req, res) => {

    const { usuario, contraseña, correo, id_rol, id_empleado } = req.body;
    const token = req.user;
    const errores = [];

    if (!usuario) errores.push('El nombre del usuario es obligatorio');
    else if (!usuarioRegex.test(usuario)) errores.push('El nombre del usuario debe tener entre 4 y 20 caracteres, y puede incluir letras, números, puntos, guiones bajos o guiones');

    if (!contraseña) errores.push('La contraseña es obligatoria');
    else if (!contraseñaRegex.test(contraseña)) errores.push('La contraseña debe tener al menos 8 caracteres, incluyendo letras y números');

    if (!correo) errores.push('El correo es obligatorio');
    else if (!correoRegex.test(correo)) errores.push('El formato de correo es inválido');

    if (!id_rol) errores.push('El ID del rol es obligatorio');

    if (errores.length > 0) return res.status(402).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const response = await createUser({ usuario, contraseña, correo, id_rol, id_empleado });
        if (!response) return res.status(201).json({
            message: 'No se pudo crear el usuario',
            data: []
        });

        const historial = await createHistorial('create', 'Usuario', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del usuario ${usuario} al historial`);
        
        return res.status(201).json({
            message: 'Usuario creado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear un nuevo usuario',
            error: error.message
        });
    }
};

// Handler para cambiar contraseña :
const changePasswordHandler = async (req, res) => {

    const { usuario, contraseña, nuevaContraseña } = req.body;
    const token = req.user;
    const errores = [];

    if (!usuario) errores.push('El nombre del usuario es obligatorio');
    else if (!usuarioRegex.test(usuario)) errores.push('El nombre del usuario debe tener entre 4 y 20 caracteres, y puede incluir letras, números, puntos, guiones bajos o guiones');

    if (!contraseña) errores.push('La contraseña actual es obligatoria');
    else if (!contraseñaRegex.test(contraseña)) errores.push('La contraseña actual debe tener al menos 8 caracteres, incluyendo letras y números');

    if (!nuevaContraseña) errores.push('La nueva contraseña es obligatoria');
    else if (!contraseñaRegex.test(nuevaContraseña)) errores.push('La nueva contraseña debe tener al menos 8 caracteres, incluyendo letras y números');

    if (errores.length > 0) return res.status(402).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const user = await getUser(usuario);
        if (!user) return res.status(404).json({
            message: 'Usuario no encontrado',
            data: []
        });

        const contraseñaCorrecta = await argon2.verify(user.dataValues.contraseña, contraseña);
        if (!contraseñaCorrecta) return res.status(400).json({
            message: 'La contraseña actual es incorrecta',
            data: []
        });

        if (await argon2.verify(user.dataValues.contraseña, nuevaContraseña)) return res.status(400).json({
            message: 'La nueva contraseña no puede ser igual a la anterior',
            data: []
        });

        const response = await changePassword(usuario, nuevaContraseña);
        if (!response) return res.status(200).json({
            message: 'No se pudo cambiar la contraseña',
            data: []
        });

        const historial = await createHistorial('update', 'Usuario', user, response, token);
        if (!historial) console.warn(`No se agregó el cambio de contraseña para el usuario ${response.id} historial`);
        
        return res.status(200).json({
            message: 'Contraseña modificada exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al cambiar la contraseña',
            error: error.message
        });
    }
};

// Handler para ingresar al sistema :
const loginHandler = async (req, res) => {

    const { usuario, contraseña } = req.body;
    const errores = [];

    if (!usuario) errores.push('El nombre del usuario es obligatorio');
    else if (!usuarioRegex.test(usuario)) errores.push('El nombre del usuario debe tener entre 4 y 20 caracteres, y puede incluir letras, números, puntos, guiones bajos o guiones');

    if (!contraseña) errores.push('La contraseña actual es obligatoria');
    else if (!contraseñaRegex.test(contraseña)) errores.push('La contraseña actual debe tener al menos 8 caracteres, incluyendo letras y números');

    if (errores.length > 0) return res.status(402).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const user = await getUser(usuario);
        if (!user) return res.status(404).json({
            message: 'Usuario no encontrado',
            data: false
        });

        const contraseñaValida = await argon2.verify(user.contraseña, contraseña);
        if (!contraseñaValida) return res.status(400).json({
            message: 'Contraseña incorrecta',
            data: false
        });

        const token = jwt.sign({ usuario: usuario, rol: user.id_rol }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        const data = { data: token };

        // Verificar si el usuario ya está conectado y forzar el logout en otros dispositivos :
        const previousSocket = userSockets.get(usuario);

        if (previousSocket) previousSocket.emit("forceLogout", {
            message: 'Sesión cerrada en otro dispositivo',
            data: { usuario: usuario }
        });

        const sesion = await signToken(usuario, token);
        if (!sesion.token) return res.status(400).json({
            message: 'Error al iniciar la sesión',
            data: false
        });

        const historial = await createHistorial('read', 'Usuario', null, { login: usuario }, data);
        if (!historial) console.warn(`No se agregó al login de ${usuario} al historial...`);
        
        return res.status(200).json({
            message: 'Sesion iniciada',
            token: token,
            rol: user.id_rol,
            data: true
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno en el login',
            error: error.message
        });
    }
};

// Handler para actualizar la información de un usuario :
const changeUserDataHandler = async (req, res) => {

    const { usuario, correo, id_rol } = req.body;
    const token = req.user;
    const errores = [];

    if (!usuario) errores.push('El nombre de usuario es obligatorio');
    if (!correo) errores.push('El correo es obligatorio');
    if (!correoRegex.test(correo)) errores.push('El formato de correo es inválido');
    if (!id_rol) errores.push('El ID de rol es obligatorio');
    if (!idRolRegex.test(id_rol)) errores.push('El ID de rol debe ser un número entero positivo');

    if (errores.length > 0) return res.status(402).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const previo = await getUser(usuario);
        if (!previo) return res.status(400).json({
            message: 'Usuario no encontrado',
            data: false
        });

        if (correo === previo.correo) errores.push('El correo es el mismo...');
        if (id_rol === previo.id_rol) errores.push('El rol es el mismo...');
        if (errores.length > 1) return res.status(400).json({ message: 'Los campos son los mismos, no se está modificando nada...' });

        const response = await changeUserData(usuario, correo, id_rol);
        if (!response) return res.status(400).json({
            message: 'No se pudo actualizar los datos del usuario',
            data: false
        });

        const historial = await createHistorial('update', 'Usuario', previo, response, token);
        if (!historial) console.warn(`No se agregó la actualización de datos de ${usuario} al historial...`);

        return res.status(200).json({
            message: 'Datos actualizados exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar los datos de un usuario',
            error: error.message
        });
    }
};

// Handler para obtener el token (PROVISIONAL)
const getTokenHandler = async (req, res) => {

    const { usuario } = req.params;

    try {
        const response = await getToken(usuario);
        if (!response) return res.status(200).json({
            message: 'No se pudo obtener el token',
            data: []
        });

        return res.status(200).json({
            message: 'Token obtenido exitosamente',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener un token',
            error: error.message
        });
    }
};

// Handler para obtener todos los usuarios con paginación y búsqueda :
const getAllUsersHandler = async (req, res) => {

    const { page = 1, limit = 20, search } = req.query;
    const filters = { search };

    const errores = [];
    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page < 0) errores.push('El page debe ser mayor a cero');
    if (isNaN(limit)) errores.push('El limit debe ser un entero');
    if (limit <= 0) errores.push('El limit debe ser mayor a cero');

    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllUsers(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) return res.status(200).json({
            message: 'Página fuera de rango...',
            data: {
                data: [],
                currentPage: numPage,
                pageCount: response.data.length,
                totalPages: totalPages,
                totalCount: response.totalCount,
            }
        });

        return res.status(200).json({
            message: 'Usuarios obtenidos exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalPages: totalPages,
                totalCount: response.totalCount,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener todos los usuarios',
            data: error.message
        });
    }
};

// Handler para obtener un usuario por ID :
const getUserByIdHandler = async (req, res) => {

    const token = req.headers.authorization.split("___")[1];
    
    try {
        const user = await getUserById(token);
        if (!user) return res.status(404).json({
            message: 'Usuario no encontrado',
            data: false
        });

        return res.status(200).json({
            message: 'Usuario encontrado exitosamente...',
            data: user
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener un usuario por ID',
            data: error.message
        });
    }
};

// Handler para eliminar a un usuario :
const deleteUserHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;

    try {
        const user = await deleteUser(id);
        if (!user) return res.status(200).json({
            message: 'Usuario no encontrado',
            data: []
        });

        const historial = await createHistorial('delete', 'Usuario', user, null, token);
        if (!historial) console.warn(`No se agregó la eliminación de ID ${id} al historial...`);

        return res.status(200).json({
            message: 'Usuario eliminado exitosamente...',
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar el usuario',
            data: error.message
        });
    }
};

// Handler para salir del sistema :
const logoutHandler = async (req, res) => {

    const authHeader = req.headers.authorization; 
    const token = authHeader.split('___')[1];
    let usuario;

    try {
        usuario = jwt.verify(token, process.env.JWT_SECRET).usuario;
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  
    if (!usuario) return res.status(400).json({ message: 'El nombre de usuario es requerido para cerrar sesión' });
  
    try {
        const result = await logoutUser(usuario);
        if (!result) return res.status(404).json({ message: 'Usuario no encontrado' });
    
        // Emitir evento de logout si el usuario está conectado :
        const socket = userSockets.get(usuario);
        if (socket) {
            socket.emit("logout", { message: 'Sesión cerrada', usuario });
            userSockets.delete(usuario);
        }
        return res.status(200).json({ message: 'Sesión cerrada correctamente' });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al cerrar sesión',
            error: error.message
        });
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