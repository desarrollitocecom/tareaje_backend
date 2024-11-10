const {Router} = require('express');
const rutas = Router();
const {
    getAllDescansosHandler,
    getDescansosHandler,
    createDescansosHandler,
    updateDescansoHandler,
    deleteDescansoHandler
} = require("../handlers/descansoHandler");

rutas.get("/", getAllDescansosHandler);
rutas.get("/:id", getDescansosHandler);
rutas.post("/", createDescansosHandler);
rutas.patch("/:id", updateDescansoHandler);
rutas.delete("/:id", deleteDescansoHandler);

module.exports=rutas;