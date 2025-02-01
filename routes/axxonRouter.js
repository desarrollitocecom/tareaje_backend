const { Router } = require('express');
const router = Router();

const { 
    createPersonHandler,
    readPersonHandler,
    deletePersonHandler,
    getEmpleadoIdHandler,
    getPhotoHandler,
    searchByFaceHandler,
    getProtocolsHandler,
    searchByFaceDNIHandler
} = require('../handlers/axxonHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

router.post('/create/', permisoAutorizacion(["all_system_access", "create_axxon"]), createPersonHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_axxon"]), readPersonHandler);
router.get('/delete/:dni', permisoAutorizacion(["all_system_access", "delete_axxon"]), deletePersonHandler);
router.get('/:dni', permisoAutorizacion(["all_system_access", "read_axxon"]), getEmpleadoIdHandler);
router.get('/photo/:id', permisoAutorizacion(["all_system_access", "read_axxon"]), getPhotoHandler);
router.post('/facescan/', permisoAutorizacion(["all_system_access", "photo_axxon"]), searchByFaceHandler);
router.post('/face/', permisoAutorizacion(["all_system_access", "photo_axxon"]), searchByFaceDNIHandler);
router.post('/protocol/', permisoAutorizacion(["all_system_access", "read_asistencia"]),getProtocolsHandler);

module.exports = router;
