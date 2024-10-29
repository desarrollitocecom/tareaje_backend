const { Router } = require('express');
const rutas = Router();
const {
    getAllEmpleadosHandlers,
    getEmpleadoHandler
  
} = require('../handlers/empleadoHandlers');

rutas.get('/', getAllEmpleadosHandlers);
rutas.get('/:id',getEmpleadoHandler);


module.exports = rutas;