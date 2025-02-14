const { Router } = require('express');
const router = Router();

const { 
    getPreguntasDISCHandler,
    createPatronDISCHandler,
    rendirPruebaDISCHandler,
    updateRespuestasDISCHandler,
    getResultadosDISCHandler,
    evaluateResultadosDISCHandler
} = require('../handlers/pruebasHandlers');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/', permisoAutorizacion(["all_system_access", "read_pruebas"]), getPreguntasDISCHandler);
router.post('/', permisoAutorizacion(["all_system_access", "read_pruebas"]), rendirPruebaDISCHandler);
router.get('/result/:id', permisoAutorizacion(["all_system_access", "read_pruebas"]), getResultadosDISCHandler);
router.post('/evaluate/', permisoAutorizacion(["all_system_access", "read_pruebas"]), evaluateResultadosDISCHandler);
// router.post('/patron/', permisoAutorizacion(["all_system_access", "read_pruebas"]), createPatronDISCHandler);
router.patch('/respuesta/:id', permisoAutorizacion(["all_system_access", "read_pruebas"]), updateRespuestasDISCHandler);

module.exports = router;