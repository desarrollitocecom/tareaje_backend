const { Router } = require('express');
const router = Router();
const { createUserHandler, changePasswordHandler, loginHandler, getTokenHandler, changeUserDataHandler, logoutHandler } = require('../handlers/usuariosHandler');


router.post("/signup", createUserHandler);
router.post("/signin", loginHandler);
router.patch("/password", changePasswordHandler);
//router.get("/token/:usuario",getTokenHandler);
router.patch("/modifyuser",changeUserDataHandler);
router.get("/logout", logoutHandler );


module.exports = router;