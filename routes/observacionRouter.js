const { Router } = require("express");
const {
  getObservacionHandler,
  createObservacionHandler,
  getAllObservacionHandler,
  updateObservacionHandler,
  deleteObservacionHandler,
  getPhotoByNameHandler,
} = require("../handlers/observacionHandler");
const validate = require("../middlewares/validar-campos");

const { saveImage, multerError } = require("../utils/observacionFiles");
const validatePhotoField = require("../middlewares/validarCampoPhoto");

const createObservacion = require("../validators/observacion/createObservacion.validator");
const getObservacion = require("../validators/observacion/getObservacion.validator");
const updateObservacion = require("../validators/observacion/updateObservacion.validator");
const deleteObservacion = require("../validators/observacion/deleteObservacion.validator");
const permisoAutorizacion = require("../checkers/roleAuth");

const publicObservacionRouter = Router();
publicObservacionRouter.post(
  "/",
  saveImage,
  multerError,
  validate(createObservacion),
  validatePhotoField,
  createObservacionHandler,
);

const observacionRouter = Router();

observacionRouter.get(
  "/",
  permisoAutorizacion(["all_system_access", "read_observacion"]),
  getAllObservacionHandler,
);
observacionRouter.get(
  "/:id",
  permisoAutorizacion(["all_system_access", "read_observacion"]),
  validate(getObservacion),
  getObservacionHandler,
);
observacionRouter.patch(
  "/:id",
  permisoAutorizacion(["all_system_access", "update_observacion"]),
  saveImage,
  multerError,
  validatePhotoField,
  validate(updateObservacion),
  updateObservacionHandler,
);
observacionRouter.delete(
  "/:id",
  permisoAutorizacion(["all_system_access", "delete_observacion"]),
  validate(deleteObservacion),
  deleteObservacionHandler,
);
observacionRouter.get(
  "/photo/:name",
  permisoAutorizacion(["all_system_access", "read_observacion"]),
  getPhotoByNameHandler,
);

module.exports = {
  publicObservacionRouter,
  observacionRouter,
};
