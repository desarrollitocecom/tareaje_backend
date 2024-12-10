const { Router } = require('express');
const router = Router();

const {
    getRangoHorarioByIdHandler,
    getAllRangosHorariosHandler,
    getRangosHorariosHoraHandler,
    createRangoHorarioHandler,
    updateRangoHorarioHandler,
    deleteRangoHorarioHandler
} = require('../handlers/rangohorarioHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id', permisoAutorizacion(["all_system_access", "read_rangohorario"]), getRangoHorarioByIdHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_rangohorario"]), getAllRangosHorariosHandler);
router.get('/hora/:hora', permisoAutorizacion(["all_system_access", "read_rangohorario"]), getRangosHorariosHoraHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_rangohorario"]), createRangoHorarioHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_rangohorario"]), updateRangoHorarioHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_rangohorario"]), deleteRangoHorarioHandler);

module.exports = router;
