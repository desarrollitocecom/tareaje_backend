const {Router} = require('express');
const router = Router();

const {
    getRangoHorarioByIdHandler,
    getAllRangosHorariosHandler,
    createRangoHorarioHandler,
    deleteRangoHorarioHandler,
    updateRangoHorarioHandler
} = require('../handlers/rangohorarioHandlers');

router.get('/', getAllRangosHorariosHandler);
router.get('/:id', getRangoHorarioByIdHandler);
router.post('/', createRangoHorarioHandler);
router.delete('/:id', deleteRangoHorarioHandler);
router.patch('/:id', updateRangoHorarioHandler);

module.exports = router;
