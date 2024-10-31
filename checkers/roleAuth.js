const permissionAuth = (permisosPermitidos = []) => {
    return async (req, res, next) => {
        // Verificar autenticación y que req.user tenga permisos cargados
        if (!req.user) {
            return res.status(401).json({ mensaje: "Usuario no autenticado" });
        }

        if (!req.user.id_rol) {
            const permisos = await getPermisosByRolId(req.user.rol); // Cargar permisos si no están en req.user
            req.user.permisos = permisos;
        }

        const userPermissions = req.user.permisos.map(permiso => permiso.nombre);
        const hasPermission = permisosPermitidos.some(permiso => userPermissions.includes(permiso));

        if (!hasPermission) {
            return res.status(403).json({ mensaje: "Acceso denegado: Permiso insuficiente" });
        }

        next();
    };
};

module.exports = permissionAuth;
