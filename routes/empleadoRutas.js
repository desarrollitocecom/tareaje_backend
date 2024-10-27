const { Router } = require('express');
const rutas = Router();
const {
    getEmpleadosHandlers,
  
} = require('../handlers/empleadoHandlers');

rutas.get('/', getEmpleadosHandlers)


module.exports = rutas;