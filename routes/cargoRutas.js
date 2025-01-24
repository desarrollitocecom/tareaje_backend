// routes/cargoRutas.js
const { Router } = require('express');
const router = Router();

const {
    getCargoByIdHandler,
    getAllCargosHandler,
    createCargoHandler,
    deleteCargoHandler,
    updateCargoHandler
} = require('../handlers/cargoHandlers');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id', permisoAutorizacion(["all_system_access", "read_cargo"]), getCargoByIdHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_cargo"]), getAllCargosHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_asistencia"]), createCargoHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_asistencia"]), updateCargoHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_asistencia"]), deleteCargoHandler);

module.exports = router;
