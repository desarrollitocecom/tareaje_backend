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
    const rangoHorarioData = req.body;
    try {
        const newRangoHorario = await createRangoHorario(rangoHorarioData);
        return res.status(200).json(newRangoHorario);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al crear el rango horario',
            error: error.message
        });
    }
};

// Handler para eliminar un rango horario
const deleteRangoHorarioHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRangoHorario = await deleteRangoHorario(id);
        if (!deletedRangoHorario) {
            return res.status(404).json({ message: 'Rango Horario no encontrado' });
        }
        return res.json(deletedRangoHorario);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el rango horario',
            error: error.message
        });
    }
};

// Handler para actualizar un rango horario
const updateRangoHorarioHandler = async (req, res) => {
    const { id } = req.params;
    const rangoHorarioData = req.body;
    try {
        const updatedRangoHorario = await updateRangoHorario(id, rangoHorarioData);
        if (!updatedRangoHorario) {
            return res.status(404).json({ message: 'Rango Horario no encontrado' });
        }
        return res.json(updatedRangoHorario);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el rango horario',
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
