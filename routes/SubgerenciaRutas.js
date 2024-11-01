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

rutas.get('/', permisoAutorizacion(["all_system_access", "read_subgerencia"]), getSubgerenciasHandler)
rutas.post('/', permisoAutorizacion(["all_system_access", "create_subgerencia"]), createSubgerenciaHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_subgerencia"]), getSubgerenciaHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_subgerencia"]), updateSubgerenciaHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_subgerencia"]), deleteSubgerenciaHandler);

module.exports = rutas;