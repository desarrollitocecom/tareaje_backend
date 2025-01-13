const { Router } = require('express');
const router = Router();

const {
    getHorarioByIdHandler,
    getAllHorariosHandler,
    getHorariosHoraHandler,
    createHorarioHandler,
    updateHorarioHandler,
    deleteHorarioHandler
} = require('../handlers/horarioHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id', permisoAutorizacion(["all_system_access", "read_horario"]), getHorarioByIdHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_horario"]), getAllHorariosHandler);
router.get('/hora/:hora', permisoAutorizacion(["all_system_access", "read_horario"]), getHorariosHoraHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_horario"]), createHorarioHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_horario"]), updateHorarioHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_horario"]), deleteHorarioHandler);

module.exports = router;
