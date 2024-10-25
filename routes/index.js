const { Router } = require("express");
const tareaje = Router();
const tareajeRutas = require("./TareajeRutas");
const SubgerenciaRutas = require("./SubgerenciaRutas");

// Usar prefijos para organizar las rutas
tareaje.use('/subgerencias', SubgerenciaRutas);  // Prefijo para las rutas de subgerencias
tareaje.use('/', tareajeRutas);                  // Rutas generales de tareaje

module.exports = tareaje;
