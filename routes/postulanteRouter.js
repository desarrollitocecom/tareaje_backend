const { Router } = require('express');
const  router = Router();

const {
    getPostulanteHandler,
    getPostulantesActualHandler,
    getBlackListActualHandler,
    getPsicologiaActualHandler,
    getPsicologiaRevisionActualHandler,
    getFisicaActualHandler,
    asistenciaFisicaActualHandler,
    getFisicaRevisionActualHandler,
    evaluateFisicaActualHandler,
    getEntrevistaActualHandler,
    getAllPostulantesHandler,
    getAllPostulantesPsicologiaHandler,
    getAllPostulantesFisicaHandler,
    createPostulanteHandler,
    updatePostulanteHandler,
    deletePostulanteHandler
} = require('../handlers/postulanteHandler');

const { uploadCv, multerError } = require('../utils/filesFunctions');
const permisoAutorizacion = require("../checkers/roleAuth");

// Módulos de postulantes - Convocatoria actual :
router.get('/', permisoAutorizacion(["all_system_access", "read_postulante"]), getPostulantesActualHandler);
router.get('/black/', permisoAutorizacion(["all_system_access", "read_postulante"]), getBlackListActualHandler);
router.get('/psico/', permisoAutorizacion(["all_system_access", "read_postulante"]), getPsicologiaActualHandler);
router.get('/psicorev/', permisoAutorizacion(["all_system_access", "read_postulante"]), getPsicologiaRevisionActualHandler);
router.get('/fisica/', permisoAutorizacion(["all_system_access", "read_postulante"]), getFisicaActualHandler);
router.post('/assist/', permisoAutorizacion(["all_system_access", "read_postulante"]), asistenciaFisicaActualHandler);
router.get('/fisicarev/', permisoAutorizacion(["all_system_access", "read_postulante"]), getFisicaRevisionActualHandler);
router.post('/evaluate/', permisoAutorizacion(["all_system_access", "read_postulante"]), evaluateFisicaActualHandler);
router.get('/pass/', permisoAutorizacion(["all_system_access", "read_postulante"]), getEntrevistaActualHandler);

// Módulos de postulantes - General :
router.post('/all/', permisoAutorizacion(["all_system_access", "read_postulante"]), getAllPostulantesHandler);
router.post('/all/psico/', permisoAutorizacion(["all_system_access", "read_postulante"]), getAllPostulantesPsicologiaHandler);
router.post('/all/fisica/', permisoAutorizacion(["all_system_access", "read_postulante"]), getAllPostulantesFisicaHandler);

// Información de un postulante :
router.get('/:id', permisoAutorizacion(["all_system_access", "read_postulante"]), getPostulanteHandler);

// Creación, actualización y eliminación de un postulante :
router.post('/', permisoAutorizacion(["all_system_access", "create_postulante"]), uploadCv, multerError, createPostulanteHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_postulante"]), uploadCv, multerError, updatePostulanteHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_postulante"]), deletePostulanteHandler);

module.exports =  router;