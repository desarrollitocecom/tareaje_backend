const { Router } = require('express');
const router = Router();
const { createUserHandler, updateUserHandler, loginHandler } = require('../handlers/usuariosHandler');

router.post("/signup", createUserHandler);
router.post("/signin", loginHandler);
router.patch("/modify", updateUserHandler);

module.exports = router;