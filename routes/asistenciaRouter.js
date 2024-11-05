const {Router} = require('express');
const router = Router();

const {
    getAsistenciaByIdHandler,
    getAsistenciaDiariaHandler,
    getAsistenciaRangoHandler,
    getAllAsistenciasHandler,
    updateAsistenciaHandler
} = require('../handlers/asistenciaHandlers');

router.get('/:id', getAsistenciaByIdHandler);
router.get('/', getAsistenciaDiariaHandler);
router.get('/', getAsistenciaRangoHandler);
router.get('/', getAllAsistenciasHandler);
router.patch('/:id', updateAsistenciaHandler);

module.exports = router;
