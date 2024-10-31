const { Router } = require('express');
const router = Router();
const { getAllUsersHandler,getUserByIdHandler, deleteUserHandler } = require('../handlers/usuariosHandler');


router.get("/", getAllUsersHandler);
router.post("/", getUserByIdHandler);
router.delete("/:id", deleteUserHandler);

module.exports = router;