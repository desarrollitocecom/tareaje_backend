const { Router } = require('express');
const rutas = Router();
const {
    getGradoEstudiosHandler,
    getGradoEstudioHandler,
    createGradoEstudioHandler,
    updateGradoEstudioHandler,
    deleteGradoEstudioHandler
} = require('../handlers/gradoEstudioHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/', permisoAutorizacion(["all_system_access", "read_gradoDeEstudio"]), getGradoEstudiosHandler)
rutas.post('/', permisoAutorizacion(["all_system_access", "create_gradoDeEstudio"]), createGradoEstudioHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_gradoDeEstudio"]), getGradoEstudioHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_gradoDeEstudio"]), updateGradoEstudioHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_gradoDeEstudio"]), deleteGradoEstudioHandler);


module.exports = rutas;