const { Router } = require('express');
const router = Router();

const { getSeguimientoHandler } = require('../handlers/seguimientoHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

router.post('/', permisoAutorizacion(["all_system_access", "read_asistencia"]), getSeguimientoHandler);

module.exports = router;
