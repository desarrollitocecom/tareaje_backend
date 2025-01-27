const { Router } = require('express');
const router = Router();

const {
    getGradoEstudiosHandler,
    getGradoEstudioHandler,
    createGradoEstudioHandler,
    updateGradoEstudioHandler,
    deleteGradoEstudioHandler
} = require('../handlers/gradoEstudioHandlers');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/', permisoAutorizacion(["all_system_access", "read_gradoDeEstudio"]), getGradoEstudiosHandler)
router.post('/', permisoAutorizacion(["all_system_access", "create_gradoDeEstudio"]), createGradoEstudioHandler);
router.get('/:id', permisoAutorizacion(["all_system_access", "read_gradoDeEstudio"]), getGradoEstudioHandler);
router.patch('/:id', permisoAutorizacion(["all_system_access", "update_gradoDeEstudio"]), updateGradoEstudioHandler);
router.delete('/:id', permisoAutorizacion(["all_system_access", "delete_gradoDeEstudio"]), deleteGradoEstudioHandler);

module.exports = router;