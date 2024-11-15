const { Router } = require('express');
const rutas = Router();
const {
    getRegimenLaboralesHandler,
    getRegimenLaboralHandler,
    createRegimenLaboralHandler,
    updateRegimenLaboralHandler,
    deleteRegimenLaboralHandler
} = require('../handlers/regimenLaboralHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");


rutas.get('/',permisoAutorizacion(["all_system_access", "read_regimenLaboral"]),getRegimenLaboralesHandler)
rutas.post('/',permisoAutorizacion(["all_system_access", "create_regimenLaboral"]), createRegimenLaboralHandler);
rutas.get('/:id',permisoAutorizacion(["all_system_access", "read_regimenLaboral"]),  getRegimenLaboralHandler);  
rutas.patch('/:id',permisoAutorizacion(["all_system_access", "update_regimenLaboral"]), updateRegimenLaboralHandler);
rutas.delete('/:id',permisoAutorizacion(["all_system_access", "delete_regimenLaboral"]), deleteRegimenLaboralHandler);

module.exports = rutas;