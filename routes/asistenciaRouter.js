const { Router } = require('express');
const router = Router();

const {
    getAsistenciaByIdHandler,
    getAsistenciaDiariaHandler,
    getAsistenciaRangoHandler,
    getAllAsistenciasHandler,
    updateAsistenciaHandler,
    createAsistenciaHandler
} = require('../handlers/asistenciaHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id', permisoAutorizacion(["all_system_access", "read_asistencia"]), getAsistenciaByIdHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_asistencia"]), getAllAsistenciasHandler);
router.get('/diaria/:fecha', permisoAutorizacion(["all_system_access", "read_asistencia"]), getAsistenciaDiariaHandler);
router.post('/', permisoAutorizacion(["all_system_access", "read_asistencia"]), getAsistenciaRangoHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_asistencia"]), updateAsistenciaHandler);

module.exports = router;
