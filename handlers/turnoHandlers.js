const { getTurnos,
    createTurno,
    getTurno,
    updateTurno,
    deleteTurno
} = require('../controllers/turnoController');

//Handlers para obtener los Turnos
const getTurnosHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page <= 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const response = await getTurnos(Number(page), Number(limit));

        // Si no hay datos, devuelve un mensaje con estado 200
        if (response.length === 0 || page > limit) {
            return res.status(200).json(
                {
                    message: 'Ya no hay mas Turnos',
                    data: {
                        data: [],
                        totalPage: response.currentPage,
                        totalCount: response.totalCount
                    }
                }
            );
        }

        // Si hay datos, devuélvelos con el mensaje correspondiente
        return res.status(200).json({
            message: 'Son los Turnos',
            data: response
        });
    } catch (error) {
        console.error('Error al obtener todas los turnos:', error);
        return res.status(500).json({ message: "Error al obtener todos los turnos" });
    }
};
//Handlers para obtener una Turno 
const getTurnoHandler = async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await getTurno(id);

        if (!response || response.length === 0) {
            return res.status(404).json({
                message: "Turno no encontrada",
                data: []
            });
        }

        return res.status(200).json({
            message: "Turno encontrada",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al buscar la Turno",
            error: error.message
        });
    }
};
//handlers para crear una nueva Turno

const createTurnoHandler = async (req, res) => {
    const { nombre } = req.body;
    const errores = [];

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre debe contener solo letras y espacios');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const nuevaTurno = await createTurno({ nombre });
        return res.status(201).json({
            message: 'Turno creado exitosamente',
            data: nuevaTurno
        });
    } catch (error) {
        console.error('Error al crear el turno:', error);
        return res.status(500).json({ message: 'Error al crear el turno', error });
    }
};

const updateTurnoHandler = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const errores = [];

    if (!id) {
        errores.push('El campo ID es requerido');
    }
    if (isNaN(id)) {
        errores.push('El campo ID debe ser un número válido');
    }

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre debe contener solo letras y espacios');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const response = await updateTurno(id, { nombre });
        if (!response) {
            return res.status(404).json({
                message: "El Turno no se encuentra",
                data: {}
            });
        }
        return res.status(200).json({
            message: "Registro modificado",
            data: response
        });
    } catch (error) {
        console.error('Error al modificar el turno:', error);
        return res.status(500).json({ message: "Error al modificar el turno", error });
    }
};

const deleteTurnoHandler = async (req, res) => {
    const id = req.params.id;
    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la Turno para eliminar (estado a inactivo)
        const response = await deleteTurno(id);

        if (!response) {
            return res.status(200).json({
                message: `No se encontró la Turno con ID:${id}`,
                data: {}
            })
        }
        return res.status(200).json({
            message: 'Turno eliminado correctamente'
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getTurnosHandler,
    getTurnoHandler,
    createTurnoHandler,
    updateTurnoHandler,
    deleteTurnoHandler
}

