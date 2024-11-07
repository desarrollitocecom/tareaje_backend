const { Router } = require('express');
const rutas = Router();
const {
    getTurnosHandler,
    getTurnoHandler,
    createTurnoHandler,
    updateTurnoHandler,
    deleteTurnoHandler
} = require('../handlers/turnoHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/', permisoAutorizacion(["all_system_access", "read_turno"]), getTurnosHandler)
rutas.post('/', permisoAutorizacion(["all_system_access", "create_turno"]), createTurnoHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_turno"]), getTurnoHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_turno"]), updateTurnoHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_turno"]), deleteTurnoHandler);


module.exports = rutas;