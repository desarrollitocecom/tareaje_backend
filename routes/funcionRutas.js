const { Router } = require('express');
const rutas = Router();
const {
    CrearFuncionHander,
    ReadFuncionHander,
    UpdateFuncionHanderls,
    DeleteFuncionHandler
} = require('../handlers/FuncionHanders');


rutas.post('/crearfuncion/', CrearFuncionHander);
rutas.get('/Consultadefuncion/:nombre', ReadFuncionHander);
rutas.patch('/Modificafuncion/:id', UpdateFuncionHanderls);
rutas.delete('/eliminaFuncion/:id', DeleteFuncionHandler);


module.exports = rutas;