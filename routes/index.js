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

const rol_permisoRouter = require("./rol_permisosRouter");
const axxonRouter = require("./axxonRouter");
const gradoEstudioRouter=require("./gradoEstudioRouter");
const jurisdiccionRouter=require('./jurisdiccionRouter');
const regimenLaboralRouter=require('./regimenLaboralRouter')
const turnoRouter=require('./turnoRouter');
const descansoRouter=require('./descansoRouter');
const feriadoRouter=require('./feriadoRouter');
const asistenciaRouter=require('./asistenciaRouter');
const rangoHorarioRouter=require('./rangoHorarioRouter');


// Usa prefijos para organizar las rutas
tareaje.use('/funciones', funcionRutas);

tareaje.use('/sexos', sexoRutas);
tareaje.use('/lugarestrabajos', lugarTrabajoRutas);
tareaje.use('/subgerencias',subgerenciaRutas);
tareaje.use('/cargos',cargoRutas);
tareaje.use('/empleados',empleadosRutas);
tareaje.use('/users', usuariosRouter);
tareaje.use('/vacaciones',vacacionesRouter);
tareaje.use('/auth',rol_permisoRouter);
tareaje.use('/axxon',axxonRouter);
tareaje.use('/descansos',descansoRouter);
tareaje.use('/turnos',turnoRouter);
tareaje.use('/regimenlaborales',regimenLaboralRouter);
tareaje.use('/gradoestudios',gradoEstudioRouter);
tareaje.use('/jurisdicciones',jurisdiccionRouter);
tareaje.use('/feriados',feriadoRouter);
tareaje.use('/asistencias',asistenciaRouter);
tareaje.use('/rangohorarios',rangoHorarioRouter);

module.exports = tareaje;
