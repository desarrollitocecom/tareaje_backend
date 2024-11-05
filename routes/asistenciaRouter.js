const {Router} = require('express');
const router = Router();

const {
    getAsistenciaByIdHandler,
    createAsistenciaHandler,
    updateAsistenciaHandler
} = require('../handlers/asistenciaHandlers');

router.get('/', getAsistenciaByIdHandler);
router.post('/', createAsistenciaHandler);
router.patch('/:id', updateAsistenciaHandler);

module.exports = router;
