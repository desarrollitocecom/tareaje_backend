const { Router } = require('express');
const rutas = Router();
const {
    getSubgerenciasHandler,
    getSubgerenciaHandler,
    createSubgerenciaHandler,
    updateSubgerenciaHandler,
    deleteSubgerenciaHandler
} = require('../handlers/subgerenciaHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/',permisoAutorizacion(["all_system_access", "read_cargo"]),getSubgerenciasHandler)
rutas.post('/',permisoAutorizacion(["all_system_access", "create_cargo"]), createSubgerenciaHandler);
rutas.get('/:id',permisoAutorizacion(["all_system_access", "read_cargo"]),  getSubgerenciaHandler);  
rutas.patch('/:id',permisoAutorizacion(["all_system_access", "update_cargo"]), updateSubgerenciaHandler);
rutas.delete('/:id',permisoAutorizacion(["all_system_access", "delete_cargo"]), deleteSubgerenciaHandler);


module.exports = rutas;