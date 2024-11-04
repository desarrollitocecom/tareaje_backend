const { Router } = require('express');
const rutas = Router();


const {
    getAllFeriadosHandler,
    getFeriadoHandler,
    createFeriadoHandler,
    updateFeriadoHandler,
    deleteFeriadoHandler
} = require('../handlers/feriadoHandler');

rutas.get('/', getAllFeriadosHandler);

rutas.get('/:id', getFeriadoHandler);

rutas.post('/', createFeriadoHandler);

rutas.put('/:id', updateFeriadoHandler);

rutas.delete('/:id', deleteFeriadoHandler);

module.exports = rutas;