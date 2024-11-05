const {
    getRangoHorarioById,
    getAllRangosHorarios,
    createRangoHorario,
    deleteRangoHorario,
    updateRangoHorario
} = require('../controllers/rangohorarioController');

// Handler para obtener un rango horario por ID
const getRangoHorarioByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const rangoHorario = await getRangoHorarioById(id);
        if (!rangoHorario) {
            return res.status(404).json({ message: 'Rango Horario no encontrado' });
        }
        return res.json(rangoHorario);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el rango horario', 
            error: error.message
        });
    }
};

// Handler para obtener todos los rangos horarios
const getAllRangosHorariosHandler = async (req, res) => {
    const { page, limit } = req.query;
    try {
        const result = await getAllRangosHorarios(page, limit);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los rangos horarios',
            error: error.message
        });
    }
};

// Handler para crear un nuevo rango horario
const createRangoHorarioHandler = async (req, res) => {
    const { inicio, fin, id_cargo, id_turno} = req.body;
    const errores = [];
    const respuestaFalta = 'Es necesario que exista el parámetro'
    if(!inicio) errores.push(`${respuestaFalta} FECHA INICIO`);
    if(!fin) errores.push(`${respuestaFalta} FECHA FIN`);
    if(!id_cargo) errores.push(`${respuestaFalta} ID CARGO`);
    if(!id_turno) errores.push(`${respuestaFalta} ID TURNO`);
    if(!/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(inicio)) errores.push('El formato para FECHA INICIO es incorrecto');
    if(!/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(fin)) errores.push('El formato para FECHA FIN es incorrecto');
    if(isNaN(id_cargo)) errores.push('El ID CARGO debe ser un entero');
    if(isNaN(id_turno)) errores.push('El ID TURNO debe ser un entero');
    if(errores.length > 0){
        return res.status(400).json({ errores });
    }
    try {
        const newRangoHorario = await createRangoHorario(inicio, fin, id_cargo, id_turno);
        return res.status(200).json(newRangoHorario);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al crear el rango horario',
            error: error.message
        });
    }
};

// Handler para actualizar un rango horario
const updateRangoHorarioHandler = async (req, res) => {
    const { id } = req.params;
    const { inicio, fin } = req.body;
    const errores = [];
    if (isNaN(id) || id <= 0) {
        errores.push("El parámetro ID fue ingresado incorrectamente" );
    }
    if (inicio && !/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(inicio)) {
        errores.push('El formato para FECHA INICIO es incorrecto');
    }
    if (fin && !/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(fin)) {
        errores.push('El formato para FECHA FIN es incorrecto');
    }
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const updatedRangoHorario = await updateRangoHorario(id, { inicio, fin });
        if (updatedRangoHorario === null) {
            return res.status(400).json({ message: 'RangoHorario no encontrado' });
        } else if (updatedRangoHorario === false) {
            return res.status(400).json({ message: 'Error al actualizar el RangoHorario' });
        }
        return res.status(200).json(updatedRangoHorario);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el rango horario',
            error: error.message
        });
    }
};

// Handler para eliminar un rango horario
const deleteRangoHorarioHandler = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "El parámetro ID fue ingresado incorrectamente" });
    }
    try {
        const deletedRangoHorario = await deleteRangoHorario(id);
        if (!deletedRangoHorario) {
            return res.status(400).json({ message: 'Rango Horario no encontrado' });
        }
        return res.json(deletedRangoHorario);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el rango horario',
            error: error.message
        });
    }
};

module.exports = {
    getRangoHorarioByIdHandler,
    getAllRangosHorariosHandler,
    createRangoHorarioHandler,
    deleteRangoHorarioHandler,
    updateRangoHorarioHandler
};
