const { Router } = require('express');
const router = Router();

const { 
    getAreaHandler,
    getAllAreasHandler,
    createAreaHandler,
    updateAreaHandler,
    deleteAreaHandler
} = require('../handlers/areaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id', permisoAutorizacion(["all_system_access", "read_area"]), getAreaHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_area"]), getAllAreasHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_area"]), createAreaHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_area"]), updateAreaHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_area"]), deleteAreaHandler);

module.exports = router;