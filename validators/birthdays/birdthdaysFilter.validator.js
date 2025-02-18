const { query } = require("express-validator");

const validarProximosCumpleanos = [
  query("desde")
    .optional()
    .custom((value) => {
      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // Validar formato YYYY-MM-DD
      if (!regex.test(value)) {
        throw new Error("El parámetro 'desde' debe ser una fecha válida en formato 'YYYY-MM-DD'");
      }
      return true;
    }),

  query("hasta")
    .optional()
    .custom((value) => {
      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // Validar formato YYYY-MM-DD
      if (!regex.test(value)) {
        throw new Error("El parámetro 'hasta' debe ser una fecha válida en formato 'YYYY-MM-DD'");
      }
      return true;
    }),

  query("hasta")
    .optional()
    .custom((value, { req }) => {
      const desde = req.query.desde;
      if (desde) {
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(value);

        if (fechaDesde > fechaHasta) {
          throw new Error("El parámetro 'desde' no puede ser posterior a 'hasta'");
        }
      }
      return true;
    })
];

module.exports = validarProximosCumpleanos;
