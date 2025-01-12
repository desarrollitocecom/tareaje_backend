const { Router } = require('express');
const router = Router();

const { 
    getBlackListByIDHandler,
    getBlackListByDNIHandler,
    getAllBlackListHandler,
    createBlackListEmpleadoHandler
} = require('../handlers/blackListHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id', permisoAutorizacion(["all_system_access", "read_blackList"]), getBlackListByIDHandler);
router.get('/dni/:dni', permisoAutorizacion(["all_system_access", "read_blackList"]), getBlackListByDNIHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_blackList"]), getAllBlackListHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_blackList"]), createBlackListEmpleadoHandler);

module.exports = router;