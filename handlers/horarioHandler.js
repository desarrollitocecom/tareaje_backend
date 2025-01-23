const {
    getHorarioById,
    getAllHorarios,
    getHorariosHora,
    createHorario,
    updateHorario,
    deleteHorario
} = require('../controllers/horarioController');

// Handler para obtener el horario por ID :
const getHorarioByIdHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es requerido');
    if (isNaN(id)) errores.push('El parámetro ID debe ser un número entero válido');
    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    try {
        const response = await getHorarioById(id);
        if (!response) return res.status(200).json({
            message: 'Horario no encontrado...',
            data: []
        });

        return res.status(200).json({
            message: 'Horario obtenido exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener el horario', 
            error: error.message
        });
    }
};

// Handler para obtener todos los horarios con paginación y filtro :
const getAllHorariosHandler = async (req, res) => {

    const { page = 1, limit = 20, subgerencia, turno, area } = req.query;
    const filters = { subgerencia, turno, area };
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page < 0) errores.push('El page debe ser mayor a cero');
    if (isNaN(limit)) errores.push('El limit debe ser un entero');
    if (limit <= 0) errores.push('El limit debe ser mayor a cero');
    
    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllHorarios(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) {
            return res.status(200).json({
                message:'Página fuera de rango...',
                data:{
                    data:[],
                    currentPage: numPage,
                    pageCount: response.data.length,
                    totalCount: response.totalCount,
                    totalPages: totalPages,
                 }
                }
            );
        }

        return res.status(200).json({
            message: 'Horarios obtenidos exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener todos los horarios',
            error: error.message
        });
    }
};

// Handler para obtener todos los horarios que coincidan con la hora de inicio (SOLO DE PRUEBA) : 
const getHorariosHoraHandler = async (req, res) => {

    const { hora } = req.params;
    const errores = [];

    if (!hora) errores.push('La hora es un parámetro obligatorio');
    if (isNaN(hora)) errores.push('La hora debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    try {
        const result = await getHorariosHora(hora);
        if (result.length === 0) return res.status(200).json({
            message: 'No se obtuvieron horarios para esta hora de inicio...',
            data: []
        });

        return res.status(200).json({
            message: 'Horarios obtenidos exitosamente para esta hora de inicio...',
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener los horarios para esta hora de inicio',
            error: error.message
        });
    }
};

// Handler para crear el horario :
const createHorarioHandler = async (req, res) => {
    
    const { inicio, fin, id_subgerencia, id_turno, id_area } = req.body;
    const errores = [];

    if (!inicio) errores.push('La hora de inicio es un parámetro obligatorio');
    if (!fin) errores.push('La hora de fin es un parámetro obligatorio');
    if (!id_subgerencia) errores.push('El ID de subgerencia es un parámetro obligatorio');
    if (!id_turno) errores.push('El ID de turno es un parámetro obligatorio');
    if (!id_area) errores.push('El ID de área es un parámetro obligatorio')
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(inicio)) errores.push('El formato para la hora de inicio es HH:MM:SS');
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(fin)) errores.push('El formato para la hora de fin es HH:MM:SS');
    if (isNaN(id_subgerencia)) errores.push('el ID de subgerencia debe ser un entero');
    if (isNaN(id_turno)) errores.push('El ID de turno debe ser un entero');
    if (isNaN(id_area)) errores.push('El ID de área debe ser un entero');

    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    try {
        const response = await createHorario(inicio, fin, id_subgerencia, id_turno, id_area);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear el horario...',
            data: []
        });

        return res.status(200).json({
            message: 'Horario creado exitosamente...',
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear el horario',
            error: error.message
        });
    }
};

// Handler para actualizar el horario :
const updateHorarioHandler = async (req, res) => {

    const { id } = req.params;
    const { inicio, fin, id_subgerencia, id_turno, id_area } = req.body;
    const errores = [];

    if (!id) errores.push('El parámetro ID es requerido');
    if (isNaN(id)) errores.push('El parámetro ID debe ser un número entero válido');
    if (!inicio) errores.push('La hora de inicio es un parámetro obligatorio');
    if (!fin) errores.push('La hora de fin es un parámetro obligatorio');
    if (!id_subgerencia) errores.push('El ID de subgerencia es un parámetro obligatorio');
    if (!id_turno) errores.push('El ID de turno es un parámetro obligatorio');
    if (!id_area) errores.push('El ID de área es un parámetro obligatorio')
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(inicio)) errores.push('El formato para la hora de inicio es HH:MM:SS');
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(fin)) errores.push('El formato para la hora de fin es HH:MM:SS');
    if (isNaN(id_subgerencia)) errores.push('el ID de subgerencia debe ser un entero');
    if (isNaN(id_turno)) errores.push('El ID de turno debe ser un entero');
    if (isNaN(id_area)) errores.push('El ID de área debe ser un entero');

    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    try {
        const horario = await getHorarioById(id);
        if (!horario) return res.status(200).json({
            message: 'Horario no encontrado...',
            data: []
        });

        const response = await updateHorario(id, inicio, fin, id_subgerencia, id_turno, id_area);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar el horario...',
            data: []
        });

        return res.status(200).json({
            message: 'Horario actualizado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error intero al actualizar el horario',
            error: error.message
        });
    }
};

// Handler para eliminar el horario :
const deleteHorarioHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es requerido');
    if (isNaN(id)) errores.push('El parámetro ID debe ser un número entero válido');
    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    try {
        const response = await deleteHorario(id);
        if (!response) return res.status(200).json({
            message: 'Horario no encontrado...',
            data: []
        });

        return res.status(200).json({
            message: 'Horario eliminado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar el horario',
            error: error.message
        });
    }
};

module.exports = {
    getHorarioByIdHandler,
    getAllHorariosHandler,
    getHorariosHoraHandler,
    createHorarioHandler,
    updateHorarioHandler,
    deleteHorarioHandler
};
