const { Router } = require('express');
const router = Router();

const {
    getSubgerenciasHandler,
    getSubgerenciaHandler,
    createSubgerenciaHandler,
    updateSubgerenciaHandler,
    deleteSubgerenciaHandler
} = require('../handlers/subgerenciaHandlers');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/',permisoAutorizacion(["all_system_access", "read_subgerencia"]), getSubgerenciasHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_subgerencia"]), getSubgerenciaHandler);
router.post('/',permisoAutorizacion(["all_system_access", "create_subgerencia"]), createSubgerenciaHandler);
router.patch('/:id',permisoAutorizacion(["all_system_access", "update_subgerencia"]), updateSubgerenciaHandler);
router.delete('/:id',permisoAutorizacion(["all_system_access", "delete_subgerencia"]), deleteSubgerenciaHandler);

module.exports = router;