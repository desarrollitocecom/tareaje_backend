const { Router } = require('express');
const router = Router();

const { 
    createPersonHandler,
    readPersonHandler,
    deletePersonHandler,
    getEmpleadoIdHandler,
    getPhotoHandler,
    searchByFaceHandler,
    getProtocolsHandler
} = require('../handlers/axxonHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

router.post('/create/', permisoAutorizacion(["all_system_access", "create_empleado"]), createPersonHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_empleado"]), readPersonHandler);
router.get('/delete/:dni', permisoAutorizacion(["all_system_access", "read_empleado"]), deletePersonHandler);
router.get('/:dni', permisoAutorizacion(["all_system_access", "read_empleado"]), getEmpleadoIdHandler);
router.get('/photo/:id', permisoAutorizacion(["all_system_access", "read_empleado"]), getPhotoHandler);
router.post('/face/', permisoAutorizacion(["all_system_access", "photo_axxon"]), searchByFaceHandler);
router.post('/protocol/', permisoAutorizacion(["all_system_access", "read_asistencia"]),getProtocolsHandler);

module.exports = router;
