const { Router } = require('express');
const rutas = Router();
const {
    CrearSexoHander,
    ReadSexoHander,
    UpdateSexoHanderls,
    DeleteSexoHandler
} = require('../handerls/SexoHanderls');



rutas.post('/crearSexo/', CrearSexoHander);
rutas.get('/consultadeSexo/:nombre', ReadSexoHander);
rutas.patch('/modificaSexo/:id', UpdateSexoHanderls);
rutas.delete('/eliminaSexo/:id', DeleteSexoHandler);

module.exports = rutas;