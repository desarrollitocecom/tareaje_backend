const { Router } = require('express');
const rutas = Router();


const {
    getAllFeriadosHandler,
    getFeriadoHandler,
    createFeriadoHandler,
    updateFeriadoHandler,
    deleteFeriadoHandler
} = require('../handlers/feriadoHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/',permisoAutorizacion(["all_system_access", "read_feriado"]), getAllFeriadosHandler);

rutas.get('/:id',permisoAutorizacion(["all_system_access", "read_feriado"]), getFeriadoHandler);

rutas.post('/',permisoAutorizacion(["all_system_access", "create_feriado"]), createFeriadoHandler);

rutas.patch('/:id',permisoAutorizacion(["all_system_access", "update_feriado"]), updateFeriadoHandler);

rutas.delete('/:id',permisoAutorizacion(["all_system_access", "delete_feriado"]), deleteFeriadoHandler);

module.exports = rutas;