const { getPermisosByRolId } = require("../controllers/rol_permisoController");
const jwt = require("jsonwebtoken");

const permisoAutorizacion = (permisosPermitidos = []) => {
    return async (req, res, next) => {
        // Verificar autenticación y que req.user tenga permisos cargados
        if (!req.user) {
            return res.status(401).json({ mensaje: "Usuario no autenticado" });
        }
        const { rol } = jwt.verify(req.user, process.env.JWT_SECRET);
        const permisos = await getPermisosByRolId(rol); // Cargar permisos si no están en req.user

        //console.log(permisosPermitidos.join(", "));
        const hasPermission = permisosPermitidos.some(permiso => permisos.includes(permiso));
          
        if (!hasPermission) {
            return res.status(403).json({ mensaje: "Acceso denegado: Permiso insuficiente" });
        }

        next();
    };
}

module.exports = permisoAutorizacion;

