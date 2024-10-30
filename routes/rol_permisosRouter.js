const { Router } = require('express');
const router = Router();
const { createPermisoHandler, createRolHandler } = require('../handlers/rol_permisoHandler');


router.post("/permiso", createPermisoHandler);
router.post("/rol", createRolHandler);
//router.delete("/:id", deleteUserHandler);

module.exports = router;