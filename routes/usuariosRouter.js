const { Router } = require('express');
const router = Router();
const { getAllUsersHandler, getUserByIdHandler, deleteUserHandler } = require('../handlers/usuariosHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.get("/", permisoAutorizacion(["all_system_access", "read_usuarios"]), getAllUsersHandler);
router.get("/:id", permisoAutorizacion(["all_system_access", "read_usuarios"]), getUserByIdHandler);
router.delete("/:usuario", permisoAutorizacion(["all_system_access", "delete_usuarios"]), deleteUserHandler);


module.exports = router;