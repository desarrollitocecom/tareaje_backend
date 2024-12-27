const { getPermisosByRolId } = require("../controllers/rol_permisoController");
const jwt = require("jsonwebtoken");

// const permisoAutorizacion = (permisosPermitidos = []) => {
    //     return async (req, res, next) => {
    //         // Verificar autenticación y que req.user tenga permisos cargados
    //         if (!req.user) {
    //             return res.status(401).json({ mensaje: "Usuario no autenticado" });
    //         }
    //         const { rol } = jwt.verify(req.user, process.env.JWT_SECRET);
    //         const permisos = await getPermisosByRolId(rol); // Cargar permisos si no están en req.user
    //         //console.log(permisosPermitidos.join(", "));
    //         const hasPermission = permisosPermitidos.some(permiso => permisos.includes(permiso));

    //         if (!hasPermission) {
    //             return res.status(403).json({ mensaje: "Acceso denegado: Permiso insuficiente" });
    //         }

    //         next();
    //     };
    // }

    // module.exports = permisoAutorizacion;
    const permisoAutorizacion = (permisosPermitidos = []) => {
        return async (req, res, next) => {
            // console.log("autorizacion:",req.user);
            if (!req.user || !req.user.rol) {
                return res.status(401).json({
                    message: "No autenticado o sin rol asignado."
                });
            }
    
            try {
                let permisos = [];
    
                if (req.user.type === 'user') {
                    
                    // 🟢 Usuario autenticado
                    permisos = await getPermisosByRolId(req.user.rol);
                } else if (req.user.type === 'apiKey') {
                    // 🔑 Permisos directamente desde la API Key
                    // console.log("ApiKeys: ",req.user);
                    permisos = await getPermisosByRolId(req.user.rol);
                }
    
                if (!permisos || permisos.length === 0) {
                    return res.status(403).json({
                        message: "El rol no tiene permisos asignados."
                    });
                }
    
                const hasPermission = permisosPermitidos.some(permiso => permisos.includes(permiso));
    
                if (!hasPermission) {
                    return res.status(403).json({
                        message: "Acceso denegado: Permiso insuficiente."
                    });
                }
    
                next();
            } catch (error) {
                console.error("Error en permisoAutorizacion:", error.message);
                return res.status(500).json({
                    message: "Error en la autorización.",
                    details: error.message
                });
            }
        };
    };
    
    module.exports = permisoAutorizacion;