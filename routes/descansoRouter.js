const {Router} = require('express');
const rutas = Router();
const {
    getAllDescansosHandler,
    getDescansosHandler,
    getDescansosRangoHandler,
    createDescansosHandler,
    updateDescansoHandler,
    deleteDescansoHandler
} = require("../handlers/descansoHandler");
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get("/",permisoAutorizacion(["all_system_access", "read_descanso"]), getAllDescansosHandler);
rutas.get("/:id",permisoAutorizacion(["all_system_access", "read_descanso"]), getDescansosHandler);
rutas.post("/rango/",permisoAutorizacion(["all_system_access", "read_descanso"]), getDescansosRangoHandler);
rutas.post("/",permisoAutorizacion(["all_system_access", "create_descanso"]), createDescansosHandler);
rutas.patch("/:id",permisoAutorizacion(["all_system_access", "update_descanso"]), updateDescansoHandler);
rutas.delete("/:id",permisoAutorizacion(["all_system_access", "delete_descanso"]), deleteDescansoHandler);

module.exports=rutas;