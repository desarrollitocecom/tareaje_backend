const {Router} = require('express');
const router = Router();

const {
    getRangoHorarioByIdHandler,
    getAllRangosHorariosHandler,
    createRangoHorarioHandler,
    updateRangoHorarioHandler,
    deleteRangoHorarioHandler
} = require('../handlers/rangohorarioHandlers');

router.get('/:id', getRangoHorarioByIdHandler);
router.get('/', getAllRangosHorariosHandler);
router.post('/', createRangoHorarioHandler);
router.patch('/:id', updateRangoHorarioHandler);
router.delete('/:id', deleteRangoHorarioHandler);

module.exports = router;
