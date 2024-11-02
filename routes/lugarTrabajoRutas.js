const { Router } = require('express');
const rutas = Router();
const {
    getLugarTrabajosHandler,
    getLugarTrabajoHandler,
    createLugarTrabajoHandler,
    updateLugarTrabajoHandler,
    deleteLugarTrabajoHandler
} = require('../handlers/lugarTrabajoHandlers')


rutas.get('/',getLugarTrabajosHandler)
rutas.post('/', createLugarTrabajoHandler);
rutas.get('/:id',  getLugarTrabajoHandler);  
rutas.patch('/:id', updateLugarTrabajoHandler);
rutas.delete('/:id', deleteLugarTrabajoHandler);

module.exports = rutas;