// routes/cargoRutas.js
const { Router } = require('express');
const rutas = Router();
const permisoAutorizacion = require("../checkers/roleAuth");

const {
    getCargoByIdHandler,
    getAllCargosHandler,
    createCargoHandler,
    deleteCargoHandler,
    updateCargoHandler
} = require('../handlers/cargoHandlers');

rutas.get('/:id', permisoAutorizacion(["all_system_access","read_cargo"]), getCargoByIdHandler);
rutas.get('/', permisoAutorizacion(["all_system_access","read_cargo"]), getAllCargosHandler);
rutas.post('/', permisoAutorizacion(["all_system_access","create_cargo"]), createCargoHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access","delete_cargo"]), deleteCargoHandler);
rutas.put('/:id', permisoAutorizacion(["all_system_access","update_cargo"]), updateCargoHandler);

module.exports = rutas;
