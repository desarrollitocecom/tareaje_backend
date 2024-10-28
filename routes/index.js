const { Router } = require("express");
const tareaje = Router();
const funcionRutas = require("./funcionRutas");
const sexoRutas = require('./sexoRutas');
const lugarTrabajoRutas = require('./lugarTrabajoRutas');
const empleadosRutas=require('./empleadoRutas')
const usuariosRouter = require("./usuariosRouter");
const subgerenciaRutas =require('./subgerenciaRutas');
const cargoRutas=require('./cargoRutas');

// Usa prefijos para organizar las rutas
tareaje.use('/funciones', funcionRutas);
tareaje.use('/sexo', sexoRutas);
tareaje.use('/lugarestrabajo', lugarTrabajoRutas);
tareaje.use('/empleado',empleadosRutas);
tareaje.use('/usuarios', usuariosRouter);
tareaje.use('/subgerencia',subgerenciaRutas);
tareaje.use('/cargo',cargoRutas);

module.exports = tareaje;
