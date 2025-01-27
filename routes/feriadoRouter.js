const { Router } = require('express');
const router = Router();

const {
    getAllFeriadosHandler,
    getFeriadoHandler,
    getFeriadoTiposHandler,
    createFeriadoHandler,
    updateFeriadoHandler,
    deleteFeriadoHandler
} = require('../handlers/feriadoHandler');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/', permisoAutorizacion(["all_system_access", "read_feriado"]), getAllFeriadosHandler);
router.get('/:id', permisoAutorizacion(["all_system_access", "read_feriado"]), getFeriadoHandler);
router.get('//tipos/', permisoAutorizacion(["all_system_access", "read_feriado"]), getFeriadoTiposHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_feriado"]), createFeriadoHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_feriado"]), updateFeriadoHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_feriado"]), deleteFeriadoHandler);

module.exports = router;