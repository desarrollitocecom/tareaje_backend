const { Rol, Permiso } = require("../db_connection");
const sequelize = require("../db_connection");


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


module.exports = {
    createRol,
    createPermiso
}