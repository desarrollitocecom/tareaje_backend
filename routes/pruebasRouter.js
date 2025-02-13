const { Router } = require('express');
const router = Router();

const { 
    getPreguntasDISCHandler,
    createPatronDISCHandler
} = require('../handlers/pruebasHandlers');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/', permisoAutorizacion(["all_system_access", "read_pruebas"]), getPreguntasDISCHandler);
router.post('/patron/', permisoAutorizacion(["all_system_access", "read_pruebas"]), createPatronDISCHandler);

module.exports = router;