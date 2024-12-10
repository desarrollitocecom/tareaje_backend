const { Router } = require('express');
const router = Router();

const {
    getAsistenciaByIdHandler,
    getAsistenciaDiariaHandler,
    getAsistenciaRangoHandler,
    getAllAsistenciasHandler,
    createAsistenciaUsuarioHandler,
    filtroAsistenciaDiariaHandler
} = require('../handlers/asistenciaHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id', permisoAutorizacion(["all_system_access", "read_asistencia"]), getAsistenciaByIdHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_asistencia"]), getAllAsistenciasHandler);
router.get('/diaria/:fecha', permisoAutorizacion(["all_system_access", "read_asistencia"]), getAsistenciaDiariaHandler);
router.post('/', permisoAutorizacion(["all_system_access", "read_asistencia"]), getAsistenciaRangoHandler);
router.post('/create/', permisoAutorizacion(["all_system_access", "create_asistencia"]), createAsistenciaUsuarioHandler);
router.get('/filtro/dia/:fecha', permisoAutorizacion(["all_system_access", "read_asistencia"]), filtroAsistenciaDiariaHandler);

module.exports = router;
