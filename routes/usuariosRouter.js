const { Router } = require('express');
const router = Router();

const { 
    getAllUsersHandler,
    getUserByIdHandler,
    createUserHandler,
    changePasswordHandler,
    changeUserDataHandler,
    deleteUserHandler 
} = require('../handlers/usuariosHandler');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get("/", permisoAutorizacion(["all_system_access", "read_usuario"]), getAllUsersHandler);
router.get("/myuser", getUserByIdHandler);
router.post('/signup', permisoAutorizacion(["all_system_access", "create_usuario"]), createUserHandler);
router.patch('/password', permisoAutorizacion(["all_system_access", "update_usuario"]), changePasswordHandler);
router.patch('/modifyuser', permisoAutorizacion(["all_system_access", "update_usuario"]), changeUserDataHandler);
router.delete("/:id", permisoAutorizacion(["all_system_access", "delete_usuario"]), deleteUserHandler);

module.exports = router;