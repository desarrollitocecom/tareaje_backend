const { QueryTypes } = require("sequelize");
const { sequelize } = require("../db_connection");

const getBirthdays = async ({ desde, hasta }) => {
    try {
        if (!desde || !hasta) {
            const hoy = new Date().toISOString().split('T')[0];
            desde = hoy;
            hasta = hoy;
        }
        
        const [desdeAnio, desdeMes, desdeDia] = desde.split('-').map(Number);
        const [hastaAnio, hastaMes, hastaDia] = hasta.split('-').map(Number);

        const orderClause = 'ORDER BY EXTRACT(MONTH FROM f_nacimiento) ASC, EXTRACT(DAY FROM f_nacimiento) ASC';

        let query = '';
        let replacements = {};

        if (desdeMes === hastaMes) {
            query = `
                SELECT *
                FROM "Empleados"
                WHERE EXTRACT(MONTH FROM f_nacimiento) = :mes
                  AND EXTRACT(DAY FROM f_nacimiento) BETWEEN :desdeDia AND :hastaDia
                ${orderClause};
            `;
            replacements = {
                mes: desdeMes,
                desdeDia,
                hastaDia,
            };
        } else {
            query = `
                SELECT *
                FROM "Empleados"
                WHERE 
                    (
                        (EXTRACT(MONTH FROM f_nacimiento) = :desdeMes AND EXTRACT(DAY FROM f_nacimiento) >= :desdeDia)
                        OR
                        (EXTRACT(MONTH FROM f_nacimiento) = :hastaMes AND EXTRACT(DAY FROM f_nacimiento) <= :hastaDia)
                        OR
                        (EXTRACT(MONTH FROM f_nacimiento) > :desdeMes AND EXTRACT(MONTH FROM f_nacimiento) < :hastaMes)
                    )
                ${orderClause};
            `;
            replacements = {
                desdeMes,
                desdeDia,
                hastaMes,
                hastaDia,
            };
        }

        const [response] = await sequelize.query(query, { replacements });

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
