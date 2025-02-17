const { Router } = require("express");
const {
  getProximosCumpleanosHandler,
} = require("../handlers/birthdaysHandler");



const validate = require("../middlewares/validar-campos");
const validarProximosCumpleanos = require("../validators/birthdays/birdthdaysFilter.validator");
// const permisoAutorizacion = require("../checkers/roleAuth");

const cumpleanosRouter = Router();

cumpleanosRouter.get(
  "/proximos",
//   permisoAutorizacion(["all_system_access", "read_cumpleanos"]),
  validate(validarProximosCumpleanos),
  getProximosCumpleanosHandler
);

module.exports = {
  cumpleanosRouter,
};