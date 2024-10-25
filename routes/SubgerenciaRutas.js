const { Router } = require('express');
const rutas = Router();
const {
    getSubgerenciasHandler,
    getSubgerenciaHandler,
    createSubgerenciaHandler,
    updateSubgerenciaHandler,
    deleteSubgerenciaHandler
} = require('../handlers/subgerenciaHandlers');

rutas.get('/',getSubgerenciasHandler)
rutas.post('/', createSubgerenciaHandler);
rutas.get('/:id',  getSubgerenciaHandler);  
rutas.patch('/:id', updateSubgerenciaHandler);
rutas.delete('/:id', deleteSubgerenciaHandler);


module.exports = rutas;