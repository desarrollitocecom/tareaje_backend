const { Router } = require('express');
const router = Router();

const {
    getAllHistorialHandler,
    getUsuarioHistorialHandler
} = require('../handlers/historialHandlers');

const permisoAutorizacion = require('../checkers/roleAuth');

router.get('/', permisoAutorizacion(["all_system_access", "read_historial"]), getAllHistorialHandler);
router.get('/:id', permisoAutorizacion(["all_system_access", "read_historial"]), getUsuarioHistorialHandler);

module.exports = router;