const { QueryTypes } = require("sequelize");
const { sequelize } = require("../db_connection");

const getBirthdays = async ({ desde, hasta, ordenarPor = "f_nacimiento" }) => {
    try {
        const [desdeAnio, desdeMes, desdeDia] = desde.split('-').map(Number);
        const [hastaAnio, hastaMes, hastaDia] = hasta.split('-').map(Number);

        const orderBy = ordenarPor === "apellidos" ? "apellidos" : "f_nacimiento";

        const query = `
            SELECT *
            FROM "Empleados"
            WHERE state = true
              AND (
                  (EXTRACT(MONTH FROM f_nacimiento) = :desdeMes AND EXTRACT(DAY FROM f_nacimiento) >= :desdeDia)
                  OR
                  (EXTRACT(MONTH FROM f_nacimiento) = :hastaMes AND EXTRACT(DAY FROM f_nacimiento) <= :hastaDia)
                  OR
                  (EXTRACT(MONTH FROM f_nacimiento) > :desdeMes AND EXTRACT(MONTH FROM f_nacimiento) < :hastaMes)
              )
            ORDER BY ${orderBy} ASC
            LIMIT 5;
        `;

        const [response] = await sequelize.query(query, {
            replacements: {
                desdeMes,
                desdeDia,
                hastaMes,
                hastaDia,
            },
        });

        if (response.length === 0) {
            throw new Error("No se encontraron empleados con cumpleaños en el rango especificado.");
        }

        return response;
    } catch (error) {
        console.error("Error al obtener los cumpleaños:", error.message);
        throw new Error(error.message);
    }
};

module.exports = {
    getBirthdays,
};
