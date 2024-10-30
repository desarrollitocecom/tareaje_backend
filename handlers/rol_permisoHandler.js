
const { createPermiso, createRol } = require("../controllers/rol_permisoController");


const createPermisoHandler = async (req, res) => {

    const { action, resource, descripcion } = req.body;

    const errors = [];
    if (!action) errors.push("action es requerida");
    if (!resource) errors.push("resource es requerida");
    if (!descripcion) errors.push("descripcion es requerida");
    if (errors.length > 0)
        return res.status(400).json({ message: "Se encontraron los siguiente errores: ", data: errors.join("\n") });

    try {
        const permiso = await createPermiso(action, resource, descripcion);
        if (permiso)
            return res.status(201).json({ message: "Permiso creado correctamente", data: permiso });
        return res.status(400).json({ message: "Error al crear el permiso", data: permiso });
    } catch (error) {
        console.error("Error en el createPermisoHandler: ", error.message);
        return res.status(500).json({ message: "Error en createPermisoHandler", error: error.message });
    }

};

const getUserPermisosHandler = async (id) => {



};

const createRolHandler = async (req, res) => {
    const { nombre, descripcion, permisos } = req.body;

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
        console.log("permisos:", permisos.length);
        const rol = await createRol(nombre, descripcion, permisos);

        if (rol) {
            return res.status(201).json({ message: "Rol creado correctamente", data: rol });
        }

        return res.status(400).json({ message: "Error al crear el rol", data: rol });
    } catch (error) {
        console.error("Error en createRolHandler:", error.message);
        return res.status(500).json({ message: "Error en createRolHandler", error: error.message });
    }
};



module.exports = {
    createPermisoHandler,
    createRolHandler
}