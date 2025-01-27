const { Router } = require('express');
const router = Router();

const {
    getLugarTrabajosHandler,
    getLugarTrabajoHandler,
    createLugarTrabajoHandler,
    updateLugarTrabajoHandler,
    deleteLugarTrabajoHandler
} = require('../handlers/lugarTrabajoHandlers');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/', permisoAutorizacion(["all_system_access", "read_lugarDeTrabajo"]), getLugarTrabajosHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_lugarDeTrabajo"]), createLugarTrabajoHandler);
router.get('/:id', permisoAutorizacion(["all_system_access", "read_lugarDeTrabajo"]), getLugarTrabajoHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "delete_lugarDeTrabajo"]), updateLugarTrabajoHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "read_lugarDeTrabajo"]), deleteLugarTrabajoHandler);

module.exports = router;