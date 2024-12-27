const jwt = require("jsonwebtoken");
const { getToken } = require("../controllers/usuarioController");
const { getApiKeyInfo } = require("../controllers/apiKeyController");

const loginMiddleware = async (req, res, next) => {
    // const token = req.headers.authorization?.split("___")[1]; // Obtener el token del header

    // if (!token) {
    //     return res.status(401).json({ message: "No se detecto sesion de usuario", request: token });
    // }

    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar si el token es válido
    //     const dbToken = await getToken(decoded.usuario);
    //     if (dbToken.dataValues.token !== token) {
    //         return res.status(401).json({ message: "Sesión inválida o expiró debido a un inicio en otro dispositivo" });
    //     }

    //     req.user = token; // Almacena la información del usuario en req para el próximo middleware
    //     next();
    // } catch (error) {
    //     console.error("Error en loginMiddleware:", error.message);
    //     return res.status(401).json({ message: "Token inválido o expirado", data: error.message });
    //}

    const authHeader = req.headers.authorization || req.headers['x-api-key'];
    if (!authHeader) {
        return res.status(401).json({ message: "No se detecto sesion de usuario" });
    }
    try {
        if (authHeader.startsWith('Bearer___')) {
            const token = authHeader.split('___')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const dbToken = await getToken(decoded.usuario);
            if (dbToken?.dataValues?.token !== token) {
                return res.status(401).json({ message: "Sesión inválida o expiró debido a un inicio en otro dispositivo" });
            }
            // console.log("decoded: ", decoded);
            req.user = {
                type: 'user',
                data: token,
                rol: decoded.rol
            }
        } else {
            const apiKey = authHeader;
            const apiKeyInfo = await getApiKeyInfo(apiKey);
            // console.log("apiKeyInfo despues de llamada: ", apiKeyInfo);
            if (!apiKeyInfo || apiKeyInfo.revoked) {
                return res.status(403).json({
                    message: "API Key inválida o revocada."
                });
            }
           
            req.user = {
                type: 'apiKey',
                data: apiKeyInfo,
                rol: apiKeyInfo.id_rol,
                // permisos: apiKeyInfo.permisos
            };

        }

        next();
    } catch (error) {
        console.error("Error en loginMiddleware:", error.message);
        return res.status(401).json({
            message: "Token o API Key inválido.",
            details: error.message
        });
    }



};



module.exports = loginMiddleware;
