const { Router } = require('express');
const rutas = Router();
const {
    getJurisdiccionesHandler,
    getJurisdiccionHandler,
    createJurisdiccionHandler,
    updateJurisdiccionHandler,
    deleteJurisdiccionHandler
} = require('../handlers/jurisdiccionHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/', permisoAutorizacion(["all_system_access", "read_jurisdiccion"]), getJurisdiccionesHandler)
rutas.post('/', permisoAutorizacion(["all_system_access", "create_jurisdiccion"]), createJurisdiccionHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_jurisdiccion"]), getJurisdiccionHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_jurisdiccion"]), updateJurisdiccionHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_jurisdiccion"]), deleteJurisdiccionHandler);


module.exports = rutas;