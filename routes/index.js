const { Router } = require("express");
const tareaje = Router();
const funcionRutas = require("./funcionRutas");
const sexoRutas = require('./sexoRutas');
const lugarTrabajoRutas = require('./lugarTrabajoRutas');
const empleadosRutas=require('./empleadoRutas')

// Usa prefijos para organizar las rutas
tareaje.use('/funciones', funcionRutas);
tareaje.use('/sexo', sexoRutas);
tareaje.use('/lugarestrabajo', lugarTrabajoRutas);
tareaje.use('/empleado',empleadosRutas);

module.exports = tareaje;