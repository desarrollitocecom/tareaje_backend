const { Router } = require('express');
const router = Router();

const {
    getTurnosHandler,
    getTurnoHandler,
    createTurnoHandler,
    updateTurnoHandler,
    deleteTurnoHandler
} = require('../handlers/turnoHandlers');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/', permisoAutorizacion(["all_system_access", "read_turno"]), getTurnosHandler)
router.get('/:id', permisoAutorizacion(["all_system_access", "read_turno"]), getTurnoHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_turno"]), createTurnoHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_turno"]), updateTurnoHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_turno"]), deleteTurnoHandler);

module.exports = router;