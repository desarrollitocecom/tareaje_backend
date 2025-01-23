const { param } = require("express-validator");

const getObservacion = [
  param("id")
    .notEmpty()
    .withMessage("El parámetro es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El parámetro debe ser un número entero positivo"),
];

module.exports = getObservacion;
