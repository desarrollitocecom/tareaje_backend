const { Router } = require('express');
const  router = Router();

const {
    getPostulanteHandler,
    getAllPostulantesHandler,
    createPostulanteHandler,
    updatePostulanteHandler,
    deletePostulanteHandler
} = require('../handlers/postulanteHandler');

const { uploadCv, multerError } = require('../utils/filesFunctions');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id',permisoAutorizacion(["all_system_access", "read_empleado"]), getPostulanteHandler);
router.get('/',permisoAutorizacion(["all_system_access", "read_empleado"]), getAllPostulantesHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_empleado"]), uploadCv, multerError, createPostulanteHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_empleado"]), uploadCv, multerError, updatePostulanteHandler);
router.delete('/:id',permisoAutorizacion(["all_system_access", "delete_empleado"]), deletePostulanteHandler);

module.exports =  router;