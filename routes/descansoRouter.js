const { Router } = require('express');
const router = Router();

const {
    getDescansoHandler,
    getAllDescansosHandler,
    getDescansosRangoHandler,
    createDescansoHandler,
    updateDescansoHandler,
    deleteDescansoHandler
} = require("../handlers/descansoHandler");
const permisoAutorizacion = require("../checkers/roleAuth");

router.get("/:id",permisoAutorizacion(["all_system_access", "read_descanso"]), getDescansoHandler);
router.get("/",permisoAutorizacion(["all_system_access", "read_descanso"]), getAllDescansosHandler);
router.post("/rango/",permisoAutorizacion(["all_system_access", "read_descanso"]), getDescansosRangoHandler);
router.post("/",permisoAutorizacion(["all_system_access", "create_descanso"]), createDescansoHandler);
router.patch("/:id",permisoAutorizacion(["all_system_access", "update_descanso"]), updateDescansoHandler);
router.delete("/:id",permisoAutorizacion(["all_system_access", "delete_descanso"]), deleteDescansoHandler);

module.exports = router;