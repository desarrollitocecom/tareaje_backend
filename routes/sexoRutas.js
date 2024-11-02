const { Router } = require('express');
const rutas = Router();
const {
    getSexosHandler,
    getSexoHandler,
    createSexoHandler,
    updateSexoHandler,
    deleteSexoHandler
} = require('../handlers/sexoHandlers');



rutas.get('/',getSexosHandler)
rutas.post('/', createSexoHandler);
rutas.get('/:id',  getSexoHandler);  
rutas.patch('/:id', updateSexoHandler);
rutas.delete('/:id', deleteSexoHandler);

module.exports = rutas;