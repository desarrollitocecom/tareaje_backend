const { Router } = require('express');
const rutas = Router();
const {
    getRegimenLaboralesHandler,
    getRegimenLaboralHandler,
    createRegimenLaboralHandler,
    updateRegimenLaboralHandler,
    deleteRegimenLaboralHandler
} = require('../handlers/regimenLaboralHandlers')


rutas.get('/',getRegimenLaboralesHandler)
rutas.post('/', createRegimenLaboralHandler);
rutas.get('/:id',  getRegimenLaboralHandler);  
rutas.patch('/:id', updateRegimenLaboralHandler);
rutas.delete('/:id', deleteRegimenLaboralHandler);

module.exports = rutas;