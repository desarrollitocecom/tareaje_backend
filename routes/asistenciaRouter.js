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
router.get('/', getAllAsistenciasHandler);
router.get('/diaria/:fecha', getAsistenciaDiariaHandler);
router.post('/', getAsistenciaRangoHandler);
router.patch('/:id', updateAsistenciaHandler);

module.exports = router;
