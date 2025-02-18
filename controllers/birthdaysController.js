const { Op } = require("sequelize");
const { Empleado } = require("../db_connection");

const getBirthdays = async ({ desde, hasta, ordenarPor = "f_nacimiento" }) => {
    try {
        const rangoDesde = desde || new Date().toISOString().split("T")[0];
        const rangoHasta = hasta || rangoDesde;

        const whereClause = {
            state: true,
            f_nacimiento: {
                [Op.between]: [rangoDesde, rangoHasta],
            },
        };

        const order = ordenarPor === "apellidos" ? [["apellidos", "ASC"]] : [["f_nacimiento", "ASC"]];
        
        const response = await Empleado.findAll({
            where: whereClause,
            order,
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
