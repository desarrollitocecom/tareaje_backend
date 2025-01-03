// routes/cargoRutas.js
const { Router } = require('express');
const rutas = Router();

const {
    getCargoByIdHandler,
    getAllCargosHandler,
    createCargoHandler,
    deleteCargoHandler,
    updateCargoHandler
} = require('../handlers/cargoHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_cargo"]), getCargoByIdHandler);
rutas.get('/', permisoAutorizacion(["all_system_access", "read_cargo"]), getAllCargosHandler);
rutas.post('/', permisoAutorizacion(["all_system_access", "create_asistencia"]), createCargoHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_asistencia"]), deleteCargoHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_asistencia"]), updateCargoHandler);

module.exports = rutas;
