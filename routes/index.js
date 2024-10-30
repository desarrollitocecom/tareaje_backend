const { Router } = require("express");
const tareaje = Router();
const funcionRutas = require("./funcionRutas");
const sexoRutas = require('./sexoRutas');
const lugarTrabajoRutas = require('./lugarTrabajoRutas');
const subgerenciaRutas =require('./subgerenciaRutas');
const cargoRutas=require('./cargoRutas');
const empleadosRutas=require('./empleadoRutas')
const vacacionesRouter=require('./vacacionesRutas')
const usuariosRouter = require("./usuariosRouter");
const rol_permisoRouter = require("./rol_permisosRouter");;
const gradoEstudioRouter=require("./gradoEstudioRouter");
const jurisdiccionRouter=require('./jurisdiccionRouter');
const regimenLaboralRouter=require('./regimenLaboralRouter')
const turnoRouter=require('./turnoRouter')


// Usa prefijos para organizar las rutas
tareaje.use('/funciones', funcionRutas);
tareaje.use('/sexo', sexoRutas);
tareaje.use('/lugarestrabajo', lugarTrabajoRutas);
tareaje.use('/subgerencia',subgerenciaRutas);
tareaje.use('/cargo',cargoRutas);
tareaje.use('/empleado',empleadosRutas);
tareaje.use('/users', usuariosRouter);
tareaje.use('/vacaciones',vacacionesRouter);
tareaje.use('/auth',rol_permisoRouter)


module.exports = tareaje;
