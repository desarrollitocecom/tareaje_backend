const {Router} = require('express');
const router = Router();

const {
    getAsistenciaByIdHandler,
    getAsistenciaDiariaHandler,
    getAsistenciaDiariaEmpleadosHandler,
    getAsistenciaRangoHandler,
    getAllAsistenciasHandler,
    updateAsistenciaHandler,
    createAsistenciaHandler
} = require('../handlers/asistenciaHandlers');

router.get('/:id', getAsistenciaByIdHandler);
router.get('/', getAllAsistenciasHandler);
router.get('/diaria/:fecha', getAsistenciaDiariaHandler);
router.post('/', getAsistenciaRangoHandler);
router.patch('/:id', updateAsistenciaHandler);
router.post('/create/', createAsistenciaHandler);

module.exports = router;
