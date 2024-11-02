// routes/cargoRutas.js
const { Router } = require('express');
const router = Router();

const { readPersonHandler } = require('../handlers/axxonHandlers');

router.get('/', readPersonHandler);


module.exports = router;
