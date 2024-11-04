
const roleAuth = async (auth) => {
    return (req, res, next) => {
        const { rol } = req.user;
        if (!rolesPermitidos.includes(rol.nombre)) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }
        next();

    }
}

