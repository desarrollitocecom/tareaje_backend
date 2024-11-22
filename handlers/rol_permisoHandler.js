
const { createPermiso, createRol, getAllRols, getRolById, getAllPermisos, getPermisoById, getPermisosByRolId, updateRol, deleteRol, deletePermiso, updatePermiso } = require("../controllers/rol_permisoController");
const { createHistorial } = require('../controllers/historialController');
const jwt = require("jsonwebtoken");

const createPermisoHandler = async (req, res) => {

    const { action, resource, descripcion } = req.body;
    const token = req.user;

    const errors = [];
    if (!action) errors.push("action es requerida");
    if (!resource) errors.push("resource es requerida");
    if (!descripcion) errors.push("descripcion es requerida");
    if (errors.length > 0)
        return res.status(400).json({ message: "Se encontraron los siguiente errores: ", data: errors.join("\n") });

    try {
        const permiso = await createPermiso(action, resource, descripcion);
        if (!permiso) return res.status(400).json({ message: "Error al crear el permiso", data: permiso });

        const historial = await createHistorial(
            'create',
            'Permiso',
            'action, resource, descripcion',
            null,
            `${action}, ${resource}, ${descripcion}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');
        
        return res.status(201).json({ message: "Permiso creado correctamente", data: permiso });
        
    } catch (error) {
        console.error("Error en el createPermisoHandler: ", error.message);
        return res.status(500).json({ message: "Error en createPermisoHandler", error: error.message });
    }

};

const getRolPermisosHandler = async (req, res) => {

    const { id } = req.params;
    const { rol, usuario } = jwt.verify(req.user, process.env.JWT_SECRET);
    const token = req.user;
    //console.log(rol, id);
    try {
        const permisos = await getPermisosByRolId(rol);

        if (permisos === null) {
            return res.status(404).json({ message: "Rol no encontrado o sin permisos asociados", data: [] });
        }

        const historial = await createHistorial(
            'read',
            'Rol',
            `Read Permiso Id ${rol}`,
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: "Permisos obtenidos correctamente",
            data: permisos
        });
    } catch (error) {
        console.error("Error en getRolPermisosHandler:", error.message);
        return res.status(500).json({ message: "Error en getRolPermisosHandler", error: error.message });
    }
};

const createRolHandler = async (req, res) => {

    const { nombre, descripcion, permisos } = req.body;
    const token = req.user;

    // Validaciones
    const errors = [];
    if (!nombre) errors.push("El nombre del rol es requerido");
    if (!descripcion) errors.push("La descripción del rol es requerida");
    if (!permisos || !Array.isArray(permisos)) errors.push("La lista de permisos es requerida y debe ser un array");

    if (errors.length > 0) {
        return res.status(400).json({ message: "Se encontraron los siguientes errores:", data: errors.join("\n") });
    }

    try {
        // Crear el rol y asociar los permisos
        const rol = await createRol(nombre, descripcion, permisos);

        if (!rol) return res.status(400).json({ message: "Error al crear el rol", data: rol });

        const historial = await createHistorial(
            'create',
            'Permiso',
            'nombre, descripcion, permisos',
            null,
            `${nombre}, ${descripcion}, ${permisos}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');
        
        return res.status(201).json({ message: "Rol creado correctamente", data: rol });

        
    } catch (error) {
        console.error("Error en createRolHandler:", error.message);
        return res.status(500).json({ message: "Error en createRolHandler", error: error.message });
    }
};

const getAllRolsHandler = async (req, res) => {

    const { page = 1, pageSize = 20 } = req.query;
    const token = req.user;
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page <= 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(pageSize)) errores.push("El pageSize debe ser un numero");
    if (pageSize <= 0) errores.push("El pageSize debe ser mayor a 0 ");
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const rols = await getAllRols(page, pageSize);

        // Calcular el total de páginas
        const totalPages = Math.ceil(rols.totalCount / pageSize);

        // Verificar si la página solicitada está fuera de rango
        if (page > totalPages) {
            return res.status(404).json({
                message: "Página fuera de rango",
                data: {
                    data: [],
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: rols.totalCount,
                }
            });
        }

        const historial = await createHistorial(
            'read',
            'Rol',
            'Read All Roles',
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: "Rols obtenidos correctamente",
            data: {
                data: rols.data,
                currentPage: page,
                totalPages: totalPages,
                totalCount: rols.totalCount,
            }
        });
    } catch (error) {
        console.error("Error en getAllRols:", error.message);
        return res.status(500).json({ message: "Error en getAllRols", error: error.message });
    }
};

const getRolByIdHandler = async (req, res) => {
    const { id } = req.params;
    const token = req.user

    try {
        const rol = await getRolById(id);
        if (rol) {
            const historial = await createHistorial(
                'read',
                'Rol',
                `Read Rol Id ${id}`,
                null,
                null,
                token
            );
            if (!historial) console.warn('No se agregó al historial...');
            return res.status(200).json({ message: "Rol obtenido correctamente", data: rol });
        }
        return res.status(404).json({ message: "Rol no encontrado", data: null });
    } catch (error) {
        console.error("Error en getRolByIdHandler:", error.message);
        return res.status(500).json({ message: "Error en getRolByIdHandler", error: error.message });
    }
};

const getAllPermisosHandler = async (req, res) => {

    const { page = 1, pageSize = 20 } = req.query;
    const token = req.user;

    try {
        const permisos = await getAllPermisos(page, pageSize);

        const totalPages = Math.ceil(permisos.totalCount / pageSize);

        if (page > totalPages) {
            return res.status(404).json({
                message: "Página fuera de rango",
                data: {
                    data: [],
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: permisos.totalCount,
                }
            });
        }

        const historial = await createHistorial(
            'read',
            'Permiso',
            'Read All Permisos',
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: "Permisos obtenidos correctamente",
            data: {
                data: permisos.data,
                currentPage: page,
                totalPages: totalPages,
                totalCount: permisos.totalCount,
            }
        });
    } catch (error) {
        console.error("Error en getAllPermisosHandler:", error.message);
        return res.status(500).json({ message: "Error en getAllPermisosHandler", error: error.message });
    }
};

const updatePermisoHandler = async (req, res) => {

    const { id } = req.params;
    const updates = req.body;
    const token = req.user;

    try {
        const permiso = await updatePermiso(id, updates);
        if (permiso)
            return res.status(200).json({ message: "Permiso actualizado correctamente", data: permiso });
        return res.status(404).json({ message: "Permiso no encontrado", data: null });
    } catch (error) {
        console.error("Error en updatePermisoHandler:", error.message);
        return res.status(500).json({ message: "Error en updatePermisoHandler", error: error.message });
    }
};

const deletePermisoHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;

    try {
        const success = await deletePermiso(id);
        if (success)
            return res.status(200).json({ message: "Permiso eliminado correctamente", data: true });
        return res.status(404).json({ message: "Permiso no encontrado", data: null });
    } catch (error) {
        console.error("Error en deletePermisoHandler:", error.message);
        return res.status(500).json({ message: "Error en deletePermisoHandler", error: error.message });
    }
};

const updateRolHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre, descripcion, permisos } = req.body;
    const token = req.user;

    try {
        const rol = await updateRol(id, nombre, descripcion, permisos);
        if (rol)
            return res.status(200).json({ message: "Rol actualizado correctamente", data: rol });
        return res.status(404).json({ message: "Rol no encontrado", data: null });
    } catch (error) {
        console.error("Error en updateRolHandler:", error.message);
        return res.status(500).json({ message: "Error en updateRolHandler", error: error.message });
    }
};

const deleteRolHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;

    try {
        const success = await deleteRol(id);
        if (success)
            return res.status(200).json({ message: "Rol eliminado correctamente", data: true });
        return res.status(404).json({ message: "Rol no encontrado", data: null });
    } catch (error) {
        console.error("Error en deleteRolHandler:", error.message);
        return res.status(500).json({ message: "Error en deleteRolHandler", error: error.message });
    }
};

const getPermisoByIdHandler = async (req, res) => {

    const { token } = req.params;

    try {
        const permiso = await getPermisoById(token);
        if (permiso)
            return res.status(200).json({ message: "Permiso obtenido correctamente", data: permiso });
        return res.status(404).json({ message: "Permiso no encontrado", data: null });
    } catch (error) {
        console.error("Error en getPermisoByIdHandler:", error.message);
        return res.status(500).json({ message: "Error en getPermisoByIdHandler", error: error.message });
    }

};

module.exports = {
    createPermisoHandler,
    createRolHandler,
    getAllRolsHandler,
    getRolPermisosHandler,
    getRolByIdHandler,
    getAllPermisosHandler,
    updatePermisoHandler,
    deletePermisoHandler,
    updateRolHandler,
    deleteRolHandler,
    getPermisoByIdHandler
};
