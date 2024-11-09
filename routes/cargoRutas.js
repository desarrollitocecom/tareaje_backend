// routes/cargoRutas.js
const {Router} = require('express');
const rutas = Router();

const { 
    getCargoByIdHandler, 
    getAllCargosHandler, 
    createCargoHandler, 
    deleteCargoHandler, 
    updateCargoHandler 
} = require('../handlers/cargoHandlers');

rutas.get('/:id', getCargoByIdHandler);
rutas.get('/', getAllCargosHandler);
rutas.post('/', createCargoHandler);
rutas.delete('/:id', deleteCargoHandler);
rutas.patch('/:id', updateCargoHandler);

module.exports = rutas;
