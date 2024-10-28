const { Router } = require("express");
const tareaje = Router();
const funcionRutas = require("./funcionRutas");
const sexoRutas = require('./sexoRutas');
const lugarTrabajoRutas = require('./lugarTrabajoRutas');
const subgerenciaRutas =require('./subgerenciaRutas');
const cargoRutas=require('./cargoRutas');
const empleadosRutas=require('./empleadoRutas')
const usuariosRouter = require("./usuariosRouter");
const vacacionesRouter=require('./vacacionesRutas')

// Usa prefijos para organizar las rutas
tareaje.use('/funciones', funcionRutas);
tareaje.use('/sexo', sexoRutas);
tareaje.use('/lugarestrabajo', lugarTrabajoRutas);
tareaje.use('/subgerencia',subgerenciaRutas);
tareaje.use('/cargo',cargoRutas);
tareaje.use('/empleado',empleadosRutas);
tareaje.use('/usuarios', usuariosRouter);
tareaje.use('/vacaciones',vacacionesRouter);


module.exports = tareaje;
