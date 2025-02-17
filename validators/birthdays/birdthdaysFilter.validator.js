const { query } = require("express-validator");

const validarProximosCumpleanos = [
  query("desde")
    .optional()
    .isDate()
    .withMessage("El parámetro 'desde' debe ser una fecha válida en formato 'YYYY-MM-DD'"),

  query("hasta")
    .optional()
    .isDate()
    .withMessage("El parámetro 'hasta' debe ser una fecha válida en formato 'YYYY-MM-DD'"),

  query("hasta")
    .optional()
    .custom((value, { req }) => {
      if (req.query.desde && new Date(req.query.desde) > new Date(value)) {
        throw new Error("El parámetro 'desde' no puede ser posterior a 'hasta'");
      }
      return true;
    })
];

module.exports = validarProximosCumpleanos;
