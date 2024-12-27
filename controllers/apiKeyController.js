const { ApiKey, Rol, Permiso } = require('../db_connection');
const crypto = require('crypto');

// Crear una nueva API Key
const createApiKey = async (app_name, id_rol) => {
    try {
        const apiKey = await ApiKey.create({
            key: crypto.randomBytes(32).toString('hex'), // Genera clave segura
            app_name,
            id_rol
        });
        return apiKey;
    } catch (error) {
        console.error("Error al crear una nueva API Key:", error.message);
        return false;
    }
};

// Obtener información de una API Key
const getApiKeyInfo = async (apiKey) => {
    try {
        const apiKeyInfo = await ApiKey.findOne({
            where: { key: apiKey, revoked: false, state: true },
            // include: [
            //     {
            //         model: Rol,
            //         as: 'rol',
            //         include: [
            //             { model: Permiso, as: 'permisos' }
            //         ]
            //     }
            // ]
        });

        if (!apiKeyInfo) return null;
        // console.log("apiKeyInfo Controlador: ", apiKeyInfo.dataValues);
        // console.log("-----------------------------------");
        return {
            id: apiKeyInfo.id,
            app_name: apiKeyInfo.app_name,
            id_rol: apiKeyInfo.id_rol,
            revoked: apiKeyInfo.revoked,
            state: apiKeyInfo.state,
            // permisos: apiKeyInfo.role?.permisos.map(p => p.nombre) || []
        };
    } catch (error) {
        console.error("Error al obtener información de la API Key:", error.message);
        return null;
    }
};

// Revocar una API Key
const revokeApiKey = async (apiKey) => {
    try {
        const apiKeyRecord = await ApiKey.findOne({ where: { key: apiKey } });
        if (!apiKeyRecord) return false;

        apiKeyRecord.revoked = true;
        await apiKeyRecord.save();
        return true;
    } catch (error) {
        console.error("Error al revocar una API Key:", error.message);
        return false;
    }
};

// Listar todas las API Keys
const getAllApiKeys = async () => {
    try {
        const apiKeys = await ApiKey.findAll({
            include: {
                model: Rol,
                as: 'rol'
            }
        });
        return apiKeys;
    } catch (error) {
        console.error("Error al listar API Keys:", error.message);
        return [];
    }
};

module.exports = {
    createApiKey,
    getApiKeyInfo,
    revokeApiKey,
    getAllApiKeys
};
