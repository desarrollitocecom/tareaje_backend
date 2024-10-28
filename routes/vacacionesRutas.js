const { Router } = require('express');
const rutas = Router();
const {
    createVacacionesHandler,
    getVacacionesHandler,
    getVacacionHandler,
    deleteVacacionesHandler,
    updateVacacionesHandler
} = require('../handlers/vacacionesHandlers');

rutas.post('/', createVacacionesHandler);
rutas.get('/',getVacacionesHandler);
rutas.get('/:id',getVacacionHandler);
rutas.patch('/:id',updateVacacionesHandler);
rutas.delete('/:id',deleteVacacionesHandler)


module.exports = rutas;