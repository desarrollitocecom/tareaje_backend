const validateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No se proporcionó un token" });
    }

    const token = authHeader.split(' ')[1];  // Bearer <token>
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const storedToken = await getToken(decoded.usuario);  // Obtiene el token almacenado en Redis

        if (token !== storedToken) {
            return res.status(401).json({ message: "Sesión inválida o cerrada desde otro dispositivo" });
        }

        // Token es válido y coincide con el almacenado
        req.usuario = decoded;  // Pasar los datos decodificados del token al siguiente middleware
        next();

    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
};

module.exports = validateToken;
