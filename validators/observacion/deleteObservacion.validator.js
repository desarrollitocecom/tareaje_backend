const { param } = require("express-validator");

const deleteObservacion = [
  param("id")
    .notEmpty()
    .withMessage("El ID es obligatorio")
    .isInt()
    .withMessage("El ID debe ser un número entero"),
];

module.exports = deleteObservacion;
