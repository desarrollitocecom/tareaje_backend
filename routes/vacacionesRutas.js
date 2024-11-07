const { Router } = require('express');
const rutas = Router();
const {
    createVacacionesHandler,
    getVacacionesHandler,
    getVacacionHandler,
    deleteVacacionesHandler,
    updateVacacionesHandler
} = require('../handlers/vacacionesHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");


rutas.post('/', permisoAutorizacion(["all_system_access", "create_vacacion"]), createVacacionesHandler);
rutas.get('/', permisoAutorizacion(["all_system_access", "read_vacacion"]), getVacacionesHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_vacacion"]), getVacacionHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_vacacion"]), updateVacacionesHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_vacacion"]), deleteVacacionesHandler)


module.exports = rutas;