const { body } = require("express-validator");

const createObservacion = [
  body("comentario").notEmpty().withMessage("El comentario es obligatorio"),
  body("ubicacion")
  .optional()
  .isString()
  .withMessage("La ubicación debe ser un texto válido"),
  body("lat")
    .notEmpty()
    .withMessage("La latitud es obligatoria")
    .custom((value) => {
      const latNum = parseFloat(value);
      if (isNaN(latNum)) {
        throw new Error("La latitud debe ser un valor numérico válido");
      }
      if (latNum < -90 || latNum > 90) {
        throw new Error("La latitud debe estar entre -90 y 90");
      }
      return true;
    }),

  body("long")
    .notEmpty()
    .withMessage("La longitud es obligatoria")
    .custom((value) => {
      const longNum = parseFloat(value);
      if (isNaN(longNum)) {
        throw new Error("La longitud debe ser un valor numérico válido");
      }
      if (longNum < -180 || longNum > 180) {
        throw new Error("La longitud debe estar entre -180 y 180");
      }
      return true;
    }),
];

module.exports = createObservacion;
