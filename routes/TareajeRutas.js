const {Router}=require('express');
const rutas=Router();
const {CrearFuncionHander,ReadFuncionHander}=require('../handerls/FuncionHanders');


rutas.post('/crear/',CrearFuncionHander);
rutas.get('/Consultadefuncion/:nombre',ReadFuncionHander);
module.exports = rutas;