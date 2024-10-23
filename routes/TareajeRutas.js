const {Router}=require('express');
const rutas=Router();
const {
    CrearFuncionHander
}=require('../handerls/FuncionHanders');

rutas.post('/crear/',CrearFuncionHander);

module.exports = rutas;