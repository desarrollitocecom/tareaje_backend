const { Router } = require("express");
const tareaje = Router();
const funcionRutas = require("./funcionRutas");
const sexoRutas = require('./sexoRutas');
const lugarTrabajoRutas = require('./lugarTrabajoRutas');

// Usa prefijos para organizar las rutas
tareaje.use('/funciones', funcionRutas);
tareaje.use('/sexos', sexoRutas);
tareaje.use('/lugarestrabajo', lugarTrabajoRutas);

module.exports = tareaje;