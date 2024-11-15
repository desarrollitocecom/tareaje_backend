const { Router } = require('express');
const rutas = Router();
const {
    getLugarTrabajosHandler,
    getLugarTrabajoHandler,
    createLugarTrabajoHandler,
    updateLugarTrabajoHandler,
    deleteLugarTrabajoHandler
} = require('../handlers/lugarTrabajoHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/', permisoAutorizacion(["all_system_access", "read_cargo"]), getLugarTrabajosHandler);
rutas.post('/', permisoAutorizacion(["all_system_access", "create_cargo"]), createLugarTrabajoHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_cargo"]), getLugarTrabajoHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "delete_cargo"]), updateLugarTrabajoHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "read_cargo"]), deleteLugarTrabajoHandler);

module.exports = rutas;