const { Router } = require('express');
const router = Router();
const { createPermisoHandler, createRolHandler, getAllRolsHandler, getRolPermisosHandler, getRolByIdHandler, getAllPermisosHandler, updatePermisoHandler, deletePermisoHandler, updateRolHandler, deleteRolHandler, getPermisoByIdHandler } = require('../handlers/rol_permisoHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.post("/permiso", permisoAutorizacion(["all_system_access", "create_permiso"]), createPermisoHandler);
router.post("/rol", permisoAutorizacion(["all_system_access", "create_rol"]),createRolHandler);
router.get("/permiso",permisoAutorizacion(["all_system_access", "read_permiso"]), getAllPermisosHandler);
router.get("/rol",permisoAutorizacion(["all_system_access", "read_rol"]), getAllRolsHandler);
router.get("/rol/:id",permisoAutorizacion(["all_system_access", "read_permiso","read_rol"]), getRolByIdHandler);
router.get("/rol/permisos/:id", /*permisoAutorizacion(["all_system_access", "read_permiso", "read_rol"]),*/ getRolPermisosHandler);
router.get("/permiso/:id",permisoAutorizacion(["all_system_access", "read_permiso"]), getPermisoByIdHandler);
router.patch("/permiso",permisoAutorizacion(["all_system_access", "update_permiso"]), updatePermisoHandler);
router.patch("/rol/:id",permisoAutorizacion(["all_system_access", "update_rol"]), updateRolHandler);
router.delete("/permiso",permisoAutorizacion(["all_system_access", "delete_permiso"]), deletePermisoHandler);
router.delete("/rol/:id",permisoAutorizacion(["all_system_access", "delete_rol"]), deleteRolHandler);

module.exports = router; 