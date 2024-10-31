const { Router } = require('express');
const rutas = Router();
const {
    getTurnosHandler,
    getTurnoHandler,
    createTurnoHandler,
    updateTurnoHandler,
    deleteTurnoHandler
} = require('../handlers/turnoHandlers');

rutas.get('/',getTurnosHandler)
rutas.post('/', createTurnoHandler);
rutas.get('/:id',  getTurnoHandler);  
rutas.patch('/:id', updateTurnoHandler);
rutas.delete('/:id', deleteTurnoHandler);


module.exports = rutas;