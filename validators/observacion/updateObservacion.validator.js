const { body, param } = require("express-validator");

const updateObservacion = [
  param("id")
    .notEmpty()
    .withMessage("El ID es obligatorio")
    .isInt()
    .withMessage("El ID debe ser un número entero"),

  body("comentario")
    .optional()
    .notEmpty()
    .withMessage("El comentario no puede estar vacío"),
  
    body("consultaStatus")
    .optional()
    .notEmpty()
    .withMessage("el estado de consulta no puede estar vacío"),

    body("ubicacion")
        .optional()
        .isString()
        .withMessage("La ubicación debe ser un texto válido"),
        
  body("lat")
    .optional()
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
    .optional()
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

  body("estado")
    .optional()
    .isIn(["ABIERTO", "CERRADO"])
    .withMessage("El estado debe ser ABIERTO O CERRADO"),
];

module.exports = updateObservacion;
