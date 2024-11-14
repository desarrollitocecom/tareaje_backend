const { Router } = require('express');
const rutas = Router();
const { getFuncionesHandler, getFuncionHandler, createFuncionHandler, updateFuncionHandler, deleteFuncionHandler } = require('../handlers/funcionHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/', permisoAutorizacion(["all_system_access", "read_funcion"]), getFuncionesHandler);
rutas.post('/', permisoAutorizacion(["all_system_access", "create_funcion"]), createFuncionHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_funcion"]), getFuncionHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_funcion"]), updateFuncionHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_funcion"]), deleteFuncionHandler);


module.exports = rutas;