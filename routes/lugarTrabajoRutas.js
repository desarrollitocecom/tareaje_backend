const { Router } = require('express');
const rutas = Router();
const {
    CrearlugarTrabajoHander,
    ReadlugarTrabajoHander,
    UpdatelugarTrabajoHanderls,
    DeletelugarTrabajoHandler
} = require('../handerls/lugarTrabajoHanders')


rutas.post('/crearlugarTrabajo/', CrearlugarTrabajoHander);
rutas.get('/consultadelugarTrabajo/:nombre', ReadlugarTrabajoHander);
rutas.patch('/modificalugarTrabajo/:id', UpdatelugarTrabajoHanderls);
rutas.delete('/eliminalugarTrabajo/:id', DeletelugarTrabajoHandler);

module.exports = rutas;