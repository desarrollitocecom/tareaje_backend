const { Router } = require("express");
const router = Router();

const funcionRutas = require("./funcionRutas");
const sexoRutas = require('./sexoRutas');
const lugarTrabajoRutas = require('./lugarTrabajoRutas');
const subgerenciaRutas =require('./SubgerenciaRutas');
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
const rangoHorarioRouter=require('./rangohorarioRouter');
const justificacionRouter = require('./justificacionRouter');
const historialRouter = require('./historialRouter');
const apiKeyRouter = require('./apiKeyRouter');
const areaRouter = require('./areaRouter');
const blackListRouter = require('./blackListRouter');
const horarioRouter = require('./horarioRouter');

// Usa prefijos para organizar las rutas :
router.use('/apikeys', apiKeyRouter);
router.use('/funciones', funcionRutas);
router.use('/sexos', sexoRutas);
router.use('/lugarestrabajos', lugarTrabajoRutas);
router.use('/subgerencias',subgerenciaRutas);
router.use('/cargos',cargoRutas);
router.use('/empleados',empleadosRutas);
router.use('/users', usuariosRouter);
router.use('/vacaciones',vacacionesRouter);
router.use('/auth',rol_permisoRouter);
router.use('/axxon',axxonRouter);
router.use('/descansos',descansoRouter);
router.use('/turnos',turnoRouter);
router.use('/regimenlaborales',regimenLaboralRouter);
router.use('/gradoestudios',gradoEstudioRouter);
router.use('/jurisdicciones',jurisdiccionRouter);
router.use('/feriados',feriadoRouter);
router.use('/asistencias',asistenciaRouter);
router.use('/rangohorarios',rangoHorarioRouter);
router.use('/justificaciones',justificacionRouter);
router.use('/historial',historialRouter);
router.use('/areas', areaRouter);
router.use('/blacklist', blackListRouter);
router.use('/horarios', horarioRouter);

module.exports = router;