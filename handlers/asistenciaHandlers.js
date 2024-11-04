const { 
    createAsistencia,
    getAsistenciaById,
    updateAsistencia
} = require('../controllers/asistenciaController');

// Handler ReadPerson :
const getAsistenciaByIdHandler = async (req,res) => {
    const { id } = req.params;
    if (!id || isNaN(id)){
        return res.status(400).json({ message: 'El parámetro ID es requerido y debe ser un Integer' });
    }
    try {
        const data = await getAsistenciaById(dni);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener la asistencia de esa persona',
            error: error.message
        });
    }
};

// Handler CreateAsistencia :
const createAsistenciaHandler = async (req, res) => {
    const { fecha, hora, dni, foto, estado, id_empleado } = req.body;
    if (!fecha || typeof(fecha) !== 'string'){
        return res.status(400).json({ message: 'El parámetro FECHA es requerido y debe ser un String' });
    }
    if (!hora || typeof(hora) !== 'string'){
        return res.status(400).json({ message: 'El parámetro HORA es requerido y debe ser un String' });
    }
    if (!dni || typeof(foto) !== 'string'){
        return res.status(400).json({ message: 'El parámetro FOTO es requerido y debe ser un String' });
    }
    if (!estado || typeof(estado) !== 'string'){
        return res.status(400).json({ message: 'El parámetro ESTADO es requerido y debe ser un String' });
    }
    if (!id_empleado || isNaN(id_empleado)){
        return res.status(400).json({ message: 'El parámetro ID EMPLEADO es requerido y debe ser un String' });
    }
    try {
        const result = await createAsistencia(fecha, hora, dni, foto, estado, id_empleado);
        if (result) {
            res.status(200).json({ 
                message: 'Asistencia creada con éxito',
                success: result
            });
        } else {
            res.status(404).json({ 
                message: 'No se pudo crear la asistencia',
                success: result
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear asistencia',
            error: error.message
        });
    }
};

// Handler UpdatePerson :
const updateAsistenciaHandler = async (req, res) => {
    const { id } = req.params;
    const { fecha, estado } = req.body;
    if (!id || isNaN(id)){
        return res.status(400).json({ message: 'El parámetro ID es requerido y debe ser un Integer' });
    }
    if (estado !== null && typeof estado !== 'string') {
        return res.status(400).json({ message: 'El parámetro ESTADO debe ser un String' });
    }
    try {
        const result = await updateAsistencia(id, estado);
        if (result) {
            return res.status(200).json({
                message: 'Usuario actualizado con éxito',
                success: result
            });
        } else {
            return res.status(400).json({
                message: 'No se pudo actualizar al usuario',
                success: result
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta',
            error: error.message
        });
    }
};

module.exports = {
    createAsistenciaHandler,
    getAsistenciaByIdHandler,
    updateAsistenciaHandler
};
