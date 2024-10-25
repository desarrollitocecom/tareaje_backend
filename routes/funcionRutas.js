const { Router } = require('express');
const rutas = Router();
const {
    getFuncionesHandler,
    getFuncionHandler,
    createFuncionHandler,
    updateFuncionHandler,
    deleteFuncionHandler
} = require('../handlers/funcionHandlers');

rutas.get('/',getFuncionesHandler)
rutas.post('/', createFuncionHandler);
rutas.get('/:id',  getFuncionHandler);  
rutas.patch('/:id', updateFuncionHandler);
rutas.delete('/:id', deleteFuncionHandler);


module.exports = rutas;