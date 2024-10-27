const { getEmpleados } = require('../controllers/empleadoController');

const getEmpleadosHandlers = async (req, res) => {
    try {
        const response = await getEmpleados(); // Llamamos a la función getEmpleados
        console.log(response);
        
        if (response) {
           return res.status(200).json(response); // Respondemos con los datos de empleados en formato JSON
        } else {
           return res.status(404).json({ message: "No se encontraron empleados activos." });
        }
    } catch (error) {
        console.error("Error al obtener empleados:", error); // Log para debugging
        res.status(500).json({ error: "Error interno del servidor al obtener los empleados." });
    }
};

module.exports = {
    getEmpleadosHandlers,
};