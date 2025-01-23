const { Router } = require('express');
const router = Router();

const {
    loginHandler,
    getTokenHandler,
    logoutHandler
} = require('../handlers/usuariosHandler');

router.post('/signin', loginHandler);
// router.get('/token/:usuario', getTokenHandler);
router.get('/logout', logoutHandler);

module.exports = router;