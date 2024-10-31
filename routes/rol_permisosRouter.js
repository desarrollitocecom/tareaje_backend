const { Router } = require('express');
const router = Router();
const { createPermisoHandler, createRolHandler, getAllRolsHandler, getRolPermisosHandler, getRolByIdHandler, getAllPermisosHandler, updatePermisoHandler, deletePermisoHandler, updateRolHandler, deleteRolHandler, getPermisoByIdHandler } = require('../handlers/rol_permisoHandler');

router.post("/permiso", createPermisoHandler);
router.post("/rol", createRolHandler);
router.get("/permiso", getAllPermisosHandler);
router.get("/rol", getAllRolsHandler);
router.get("/rol/:id", getRolByIdHandler);
router.get("/rol/permisos/:id", getRolPermisosHandler);
router.get("/permiso/:id", getPermisoByIdHandler);
router.patch("/permiso", updatePermisoHandler);
router.patch("/rol/:id", updateRolHandler);
router.delete("/permiso", deletePermisoHandler);
router.delete("/rol", deleteRolHandler);

module.exports = router;