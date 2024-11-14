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

// router.post('/create/', createPersonHandler);
// router.get('/', readPersonHandler);
// router.post('/update/', updatePersonHandler);
// router.get('/delete/:dni', deletePersonHandler);
// router.get('/:dni', getEmpleadoIdHandler);
router.get('/photo/:id', getPhotoHandler);
router.post('/face/', searchByFaceHandler);
// router.post('/protocol/', getProtocolsHandler);

module.exports = router;
