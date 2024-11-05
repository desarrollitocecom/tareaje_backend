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

router.get('/', createPersonHandler);
router.get('/', readPersonHandler);
router.get('/:dnikey', updatePersonHandler);
router.get('/:dnikey', deletePersonHandler);
router.get('/:dni', getEmpleadoIdHandler);
router.get('/:id', getPhotoHandler);
router.get('/', searchByFaceHandler);
router.get('/', getProtocolsHandler);

module.exports = router;
