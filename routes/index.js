const { Router } = require("express");
const tareaje = Router();
const funcionRutas = require("./funcionRutas");
const sexoRutas = require('./sexoRutas');
const lugarTrabajoRutas = require('./lugarTrabajoRutas');
const empleadosRutas=require('./empleadoRutas')
const vacacionesRutas=require('./vacacionesRutas')
// Usa prefijos para organizar las rutas
tareaje.use('/funciones', funcionRutas);
tareaje.use('/sexo', sexoRutas);
tareaje.use('/lugarestrabajo', lugarTrabajoRutas);
tareaje.use('/empleado',empleadosRutas);
tareaje.use('/vacaciones',vacacionesRutas);
module.exports = tareaje;