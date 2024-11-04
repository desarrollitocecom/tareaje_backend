const { Rol, Permiso } = require("../db_connection");

const createRol = async (nombre, descripcion, permisos) => {

    try {
        const rol = await Rol.create({
            nombre: nombre,
            descripcion: descripcion
        });

        // Busca los permisos y asócialos al rol
        if (permisos && permisos.length > 0) {
            const permisosEncontrados = await Permiso.findAll({ where: { id: permisos } });
            //console.log('Rol: ', rol);
            await rol.addPermisos(permisosEncontrados); // Agrega la relación muchos a muchos

        }

        return rol;
    } catch (error) {
        console.error('Error al crear un nuevo rol:', error);
        return false;
    }

};

const createPermiso = async (action, resource, descripcion) => {

    try {
        const permiso = await Permiso.create({
            nombre: `${action}_${resource}`,
            descripcion: descripcion
        });

        return permiso || null;
    } catch (error) {
        console.error('Error al crear un nuevo permiso:', error);
        return false;
    }

};

const getAllRols = async (page = 1, pageSize = 20) => {
    try {
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const response = await Rol.findAndCountAll({
            where: { state: true },
            include: {
                model: Permiso,
                as: 'permisos',
                attributes: ['id', 'nombre', 'descripcion']
            },
            limit,
            offset,
            order: [['nombre', 'DESC']]
        });
        console.log(page, response.count);
        return {
            data: response.rows,
            currentPage: page,
            totalCount: response.count,
        };
    } catch (error) {
        console.error('Error al obtener los roles:', error);
        return false;
    }
};


const getRolById = async (id) => {
    try {
        const rol = await Rol.findByPk(id, {
            include: {
                model: Permiso,
                as: 'permisos',
                attributes: ['id', 'nombre', 'descripcion']
            }
        });
        return rol || null;
    } catch (error) {
        console.error("Error al obtener el rol por ID:", error);
        return false;
    }
};

const getAllPermisos = async (page = 1, pageSize = 20) => {
    try {
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const response = await Permiso.findAndCountAll({
            where: { state: true },
            limit,
            offset,
            order: [['id', 'ASC']]
        });

        return {
            data: response.rows,
            currentPage: page,
            totalCount: response.count,
        };
    } catch (error) {
        console.error("Error en getAllPermisos ", error.message);
        return false;
    }
};

const getPermisoById = async (id) => {

    try {
        const permiso = await Permiso.findByPk({
            where: { state: true },
        });
        return permiso || null;
    } catch (error) {
        console.error("Error en getAllPermisos ", error.message);
        return false;
    }

};

const updatePermiso = async (id, nombre, descripcion) => {
    try {
        const permiso = await Permiso.findByPk(id);
        if (!permiso) return null;
        const updates = {};
        if (nombre !== undefined) updates.nombre = nombre;
        if (descripcion !== undefined) updates.descripcion = descripcion;
        await permiso.update(updates);
        return permiso;
    } catch (error) {
        console.error("Error al actualizar el permiso:", error);
        return false;
    }
};

const updateRol = async (id, nombre, descripcion, permisos = []) => { 
    try {
       
        const rol = await Rol.findByPk(id);
        if (!rol) return null;

        const updates = {};
        if (nombre !== undefined) updates.nombre = nombre;
        if (descripcion !== undefined) updates.descripcion = descripcion;

        await rol.update(updates);

        // Actualizar permisos asociados si se proporcionan
        if (permisos.length > 0) {
            const permisosEncontrados = await Permiso.findAll({ where: { id: permisos } });
            await rol.setPermisos(permisosEncontrados); // Actualiza la relación del rol con los permisos
        }

        return rol;
    } catch (error) {
        console.error("Error al actualizar el rol y sus permisos:", error);
        return false;
    }
};

const deletePermiso = async (id) => {
    try {
        const permiso = await Permiso.findByPk(id);
        if (!permiso) return null;

        await permiso.update({ state: false });
        return true;
    } catch (error) {
        console.error("Error al realizar el borrado lógico del permiso:", error);
        return false;
    }
};

const deleteRol = async (id) => {
    try {
        const rol = await Rol.findByPk(id);
        if (!rol) return null;

        await rol.update({ state: false });
        return true;
    } catch (error) {
        console.error("Error al realizar el borrado lógico del rol:", error);
        return false;
    }
};


const getPermisosByRolId = async (id_rol) => {
    //console.log("id: ",id_rol);
    try {
        // Buscar el rol con sus permisos
        const rol = await Rol.findByPk(id_rol, {
            include: {
                model: Permiso,
                as: 'permisos',
                attributes: ['nombre']
            }
        });
    
        // Si no existe el rol o no tiene permisos, devolvemos un array vacío
        if (!rol) return null;
        //console.log(`rol ${id_rol} tiene los permisos: `,rol.permisos.map(permiso => permiso.nombre));
        return rol.permisos.map(permiso => permiso.nombre) || [];
    } catch (error) {
        console.error("Error en getPermisosByRolId:", error.message);
        return false;
    }
};

module.exports = {
    createRol,
    createPermiso,
    getAllRols,
    getRolById,
    getAllPermisos,
    getPermisoById,
    updatePermiso,
    deletePermiso,
    updateRol,
    deleteRol,
    getPermisosByRolId
};

