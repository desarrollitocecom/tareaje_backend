const { Router } = require('express');
const router = Router();

const { 
    getPreguntasDISCHandler
} = require('../handlers/pruebasHandlers');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/', permisoAutorizacion(["all_system_access", "read_pruebas"]), getPreguntasDISCHandler);

module.exports = router;