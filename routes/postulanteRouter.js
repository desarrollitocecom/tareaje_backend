const { Router } = require('express');
const rutas = Router();

const {
    getPostulanteHandler,
    getAllPostulantesHandler,
    createPostulanteHandler
} = require('../handlers/postulanteHandler');

const { uploadCv, multerError } = require('../utils/filesFunctions');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/:id',permisoAutorizacion(["all_system_access", "read_empleado"]), getPostulanteHandler);
rutas.get('/',permisoAutorizacion(["all_system_access", "read_empleado"]), getAllPostulantesHandler);
rutas.post('/', permisoAutorizacion(["all_system_access", "create_empleado"]), uploadCv, multerError, createPostulanteHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_empleado"]), uploadCv, multerError, );
rutas.delete('/:id',permisoAutorizacion(["all_system_access", "delete_empleado"]), );

module.exports = rutas;