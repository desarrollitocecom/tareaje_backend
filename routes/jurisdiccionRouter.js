const { Router } = require('express');
const rutas = Router();
const {
    getJurisdiccionesHandler,
    getJurisdiccionHandler,
    createJurisdiccionHandler,
    updateJurisdiccionHandler,
    deleteJurisdiccionHandler
} = require('../handlers/jurisdiccionHandlers');

rutas.get('/',getJurisdiccionesHandler)
rutas.post('/', createJurisdiccionHandler);
rutas.get('/:id',  getJurisdiccionHandler);  
rutas.patch('/:id', updateJurisdiccionHandler);
rutas.delete('/:id', deleteJurisdiccionHandler);


module.exports = rutas;