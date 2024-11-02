const { Router } = require('express');
const rutas = Router();
const {
    getGradoEstudiosHandler,
    getGradoEstudioHandler,
    createGradoEstudioHandler,
    updateGradoEstudioHandler,
    deleteGradoEstudioHandler
} = require('../handlers/gradoEstudioHandlers');

rutas.get('/',getGradoEstudiosHandler)
rutas.post('/', createGradoEstudioHandler);
rutas.get('/:id',  getGradoEstudioHandler);  
rutas.patch('/:id', updateGradoEstudioHandler);
rutas.delete('/:id', deleteGradoEstudioHandler);


module.exports = rutas;