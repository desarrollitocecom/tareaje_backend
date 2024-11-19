const { Router } = require('express');
const router = Router();

const {
    getJustificacionByIdHandler,
    getAllJustificacionesHandler,
    createJustificacionHandler,
    updateJustificacionHandler,
    getJustificacionWithPdfHandler
} = require('../handlers/justificacionHandlers');

const { savePdf, multerError } = require('../utils/filesFunctions');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/:id', permisoAutorizacion(["all_system_access", "read_justificacion"]), getJustificacionByIdHandler);
router.get('/', permisoAutorizacion(["all_system_access", "read_justificacion"]), getAllJustificacionesHandler);
router.post('/', permisoAutorizacion(["all_system_access", "create_justificacion"]), savePdf, multerError, createJustificacionHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_justificacion"]), updateJustificacionHandler);
router.get('/pdf/:id', permisoAutorizacion(["all_system_access", "read_justificacion"]), getJustificacionWithPdfHandler);

module.exports = router;
