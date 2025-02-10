const { Router } = require('express');
const router = Router();

const { 
    getConvocatoriaHandler,
    getAllConvocatoriasHandler,
    createConvocatoriaHandler,
    updateConvocatoriaHandler,
    deleteConvocatoriaHandler
} = require('../handlers/convocatoriaHandler');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id', permisoAutorizacion(["all_system_access", "read_convocatoria"]), getConvocatoriaHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_convocatoria"]), getAllConvocatoriasHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_convocatoria"]), createConvocatoriaHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_convocatoria"]), updateConvocatoriaHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_convocatoria"]), deleteConvocatoriaHandler);

module.exports = router;