const { createApiKey, revokeApiKey, getAllApiKeys, getApiKeyInfo } = require('../controllers/apiKeyController');

const createApiKeyHandler = async (req, res) => {
    const { app_name, id_rol } = req.body;
    const errores = [];

    if (!app_name) errores.push('El campo app_name es obligatorio');
    if (!id_rol) errores.push('El campo id_rol es obligatorio');

    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            errors: errores
        });
    }

    try {
        const apiKey = await createApiKey(app_name, id_rol);
        if (!apiKey) {
            return res.status(500).json({
                message: "No se pudo crear la API Key debido a un error interno"
            });
        }

        res.status(201).json({
            message: "API Key creada exitosamente",
            data: { apiKey: apiKey.key }
        });
    } catch (error) {
        console.error("Error en createApiKeyHandler:", error.message);
        res.status(500).json({
            message: "Error interno del servidor al crear la API Key",
            details: error.message
        });
    }
};

const revokeApiKeyHandler = async (req, res) => {
    const { key } = req.body;
    const errores = [];

    if (!key) errores.push('El campo key es obligatorio');

    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            errors: errores
        });
    }

    try {
        const revoked = await revokeApiKey(key);
        if (!revoked) {
            return res.status(200).json({
                message: "La API Key no existe o ya estaba revocada"
            });
        }

        res.status(200).json({
            message: "API Key revocada correctamente"
        });
    } catch (error) {
        console.error("Error en revokeApiKeyHandler:", error.message);
        res.status(500).json({
            message: "Error interno del servidor al revocar la API Key",
            details: error.message
        });
    }
};


const getAllApiKeysHandler = async (req, res) => {
    try {
        const apiKeys = await getAllApiKeys();

        if (!apiKeys || apiKeys.length === 0) {
            return res.status(200).json({
                message: "No se encontraron API Keys.",
                data: []
            });
        }

        res.status(200).json({
            message: "API Keys obtenidas exitosamente.",
            data: apiKeys
        });
    } catch (error) {
        console.error("Error en getAllApiKeysHandler:", error.message);
        res.status(500).json({
            message: "Error interno del servidor al obtener las API Keys.",
            details: error.message
        });
    }
};

const getApiKeyInfoHandler = async (req, res) => {
    const { key } = req.params;
    const errores = [];

    if (!key) errores.push('El campo key es obligatorio');

    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            errors: errores
        });
    }

    try {
        const apiKeyInfo = await getApiKeyInfo(key);

        if (!apiKeyInfo) {
            return res.status(200).json({
                message: "No se encontró información para la API Key proporcionada.",
                data: {}
            });
        }

        res.status(200).json({
            message: "Información de la API Key obtenida exitosamente.",
            data: apiKeyInfo
        });
    } catch (error) {
        console.error("Error en getApiKeyInfoHandler:", error.message);
        res.status(500).json({
            message: "Error interno del servidor al obtener la información de la API Key.",
            details: error.message
        });
    }
};

module.exports = {
    createApiKeyHandler,
    revokeApiKeyHandler,
    getAllApiKeysHandler,
    getApiKeyInfoHandler
};
