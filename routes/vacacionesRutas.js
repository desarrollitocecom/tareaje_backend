const { Router } = require('express');
const router = Router();

const {
    createVacacionHandler,
    getVacacionesHandler,
    getVacacionHandler,
    deleteVacacionesHandler,
    updateVacacionHandler
} = require('../handlers/vacacionesHandlers');

const permisoAutorizacion = require("../checkers/roleAuth");

router.post('/', permisoAutorizacion(["all_system_access", "create_vacacion"]), createVacacionHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_vacacion"]), getVacacionesHandler);
router.get('/:id', permisoAutorizacion(["all_system_access", "read_vacacion"]), getVacacionHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_vacacion"]), updateVacacionHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_vacacion"]), deleteVacacionesHandler)

module.exports = router;