const express = require('express');
const router = express.Router();
const { createApiKeyHandler, revokeApiKeyHandler, getAllApiKeysHandler, getApiKeyInfoHandler } = require('../handlers/apiKeyHandler');

// Crear una API Key
router.post('/create', createApiKeyHandler);

// Revocar una API Key
router.post('/revoke', revokeApiKeyHandler);

// Listar API Keys
router.get('/list', getAllApiKeysHandler);

module.exports = router;
