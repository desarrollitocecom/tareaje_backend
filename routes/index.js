const { Router } = require("express");
const tareaje = Router();
const tareajeRutas = require("./TareajeRutas");


tareaje.use(tareajeRutas);

module.exports = tareaje;