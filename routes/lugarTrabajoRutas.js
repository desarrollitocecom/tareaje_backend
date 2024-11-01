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


rutas.get('/', permisoAutorizacion(["all_system_access", "read_lugarDeTrabajo"]), getLugarTrabajosHandler)
rutas.post('/', permisoAutorizacion(["all_system_access", "create_lugarDeTrabajo"]), createLugarTrabajoHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_lugarDeTrabajo"]), getLugarTrabajoHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_lugarDeTrabajo"]), updateLugarTrabajoHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_lugarDeTrabajo"]), deleteLugarTrabajoHandler);

module.exports = rutas;