const { Router } = require('express');
const router = Router();

const { 
    createPersonHandler,
    readPersonHandler,
    updatePersonHandler,
    deletePersonHandler,
    getEmpleadoIdHandler,
    getPhotoHandler,
    searchByFaceHandler,
    getProtocolsHandler
} = require('../handlers/axxonHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/', createPersonHandler);
router.get('/', readPersonHandler);
router.get('/:dnikey', updatePersonHandler);
router.get('/:dnikey', deletePersonHandler);
router.get('/:dni', getEmpleadoIdHandler);
router.get('/photo/:id', getPhotoHandler);
router.get('/', searchByFaceHandler);
router.get('/protocol', getProtocolsHandler);

module.exports = router;
