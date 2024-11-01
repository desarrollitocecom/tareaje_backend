const { Router } = require('express');
const rutas = Router();
const {
    getSexosHandler,
    getSexoHandler,
    createSexoHandler,
    updateSexoHandler,
    deleteSexoHandler
} = require('../handlers/sexoHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");



rutas.get('/', permisoAutorizacion(["all_system_access", "read_sexo"]), getSexosHandler)
rutas.post('/', permisoAutorizacion(["all_system_access", "create_sexo"]), createSexoHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_sexo"]), getSexoHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_sexo"]), updateSexoHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_sexo"]), deleteSexoHandler);

module.exports = rutas;