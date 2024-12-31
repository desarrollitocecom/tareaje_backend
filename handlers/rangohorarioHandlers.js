const {
    getRangoHorarioById,
    getAllRangosHorarios,
    getRangosHorariosHora,
    createRangoHorario,
    deleteRangoHorario,
    updateRangoHorario,
    getAreaRangoHorario
} = require('../controllers/rangohorarioController');

// Handler para obtener un rango de horario por ID :
const getRangoHorarioByIdHandler = async (req, res) => {

    const { id } = req.params;

    try {
        const response = await getRangoHorarioById(id);
        if (!response) return res.status(404).json({ message: 'Rango de horario no encontrado', data: [] });
        return res.json({
            message: 'Rango de horario obtenido exitosamente',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el rango horario', 
            error: error.message
        });
    }
};

// Handler para obtener todos los horarios con paginación y búsqueda :
const getAllRangosHorariosHandler = async (req, res) => {

    const { page = 1, limit = 20, search } = req.query;
    const filters = { search };
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");

    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllRangosHorarios(page, limit, filters);
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
            message: 'Error al obtener los rangos horarios',
            error: error.message
        });
    }
};

// Handler para obtener todos los rangos de horario para una hora en específico:
const getRangosHorariosHoraHandler = async (req, res) => {

    const { hora } = req.params;
    const errores = [];

    if (!hora) errores.push('La hora es un parámetro obligatorio');
    if (isNaN(hora)) errores.push('La hora debe ser un entero');
    if (errores.length > 0) return res.status(400).json({ message: "Se encontraron los siguentes errores:", data: errores });

    try {
        const result = await getRangosHorariosHora(hora);
        if (result.length === 0) return res.json({ message: 'No se obtuvieron los rangos de horario para esta hora', data: [] });
        return res.json({
            message: 'Rangos de horario obtenidos exitosamente',
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los rangos horarios',
            error: error.message
        });
    }
};

// Handler para obtener las áreas de los Rangos de Horario :
const getAreaRangoHorarioHandler = async (req, res) => {

    try {
        const result = await getAreaRangoHorario();
        if (!result) return res.status(200).json({ message: 'No se obtuvieron las áreas de los horarios', data: [] });
        return res.status(200).json({
            message: 'Áreas de los horarios obtenidas exitosamente',
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los rangos horarios',
            error: error.message
        });
    }
};

// Handler para crear un nuevo rango de horario :
const createRangoHorarioHandler = async (req, res) => {
    
    const { nombre, inicio, fin, ids_funcion, id_turno, id_subgerencia } = req.body;
    const errores = [];

    if (!nombre) errores.push('El nombre es un parámetro obligatorio');
    if (!inicio) errores.push('La hora de inicio es un parámetro obligatorio');
    if (!fin) errores.push('La hora de fin es un parámetro obligatorio');
    if (!ids_funcion) errores.push('Los ids de las funciones son parámetros obligatorios');
    if (!id_turno) errores.push('El id de turno es un parámetro obligatorio');
    if (!id_subgerencia) errores.push('El id de subgerencia es un parámetro obligatorio');

    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(inicio)) errores.push('El formato para la hora de inicio es HH:MM:SS');
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(fin)) errores.push('El formato para la hora de fin es HH:MM:SS');
    if (isNaN(id_turno)) errores.push('El id de turno debe ser un entero');
    if (isNaN(id_subgerencia)) errores.push('el id de subgerencia debe ser un entero');
    if (errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await createRangoHorario(nombre, inicio, fin, ids_funcion, id_turno, id_subgerencia);
        if (!response) return res.status(400).json({ message: 'No se pudo crear el rango de horario', data: [] });
        return res.status(200).json({
            message: 'Rango de horario creado exitosamente',
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error al crear el rango de horario',
            error: error.message
        });
    }
};

// Handler para actualizar un rango de horario :
const updateRangoHorarioHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre, inicio, fin, ids_funcion, id_turno, id_subgerencia } = req.body;
    const errores = [];

    if (!id) errores.push('El id es un parámetro obligatorio');
    if (!nombre) errores.push('El nombre es un parámetro obligatorio');
    if (!inicio) errores.push('La hora de inicio es un parámetro obligatorio');
    if (!fin) errores.push('La hora de fin es un parámetro obligatorio');
    if (!ids_funcion) errores.push('Los ids de las funciones son parámetros obligatorios');
    if (!id_turno) errores.push('El id de turno es un parámetro obligatorio');
    if (!id_subgerencia) errores.push('El id de subgerencia es un parámetro obligatorio');

    if (isNaN(id)) errores.push("El parámetro ID fue ingresado incorrectamente" );
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(inicio)) errores.push('El formato para la hora de inicio es HH:MM:SS');
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(fin)) errores.push('El formato para la hora de fin es HH:MM:SS');
    if (ids_funcion.length === 0) errores.push('La lista de ids de las funciones está vacía');
    if (ids_funcion.some(e => isNaN(e))) errores.push('Los ids de funciones deben ser enteros');
    if (isNaN(id_turno)) errores.push('El id de turno debe ser un entero');
    if (isNaN(id_subgerencia)) errores.push('el id de subgerencia debe ser un entero');
    if (errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await updateRangoHorario(id, nombre, inicio, fin, ids_funcion, id_turno, id_subgerencia);
        if (response === 1) return res.status(400).json({ message: 'Rango de horario no encontrado', data: [] });
        if (!response) return res.status(400).json({ message: 'No se pudo actualizar el rango de horario', data: [] });
        return res.status(200).json({
            message: 'Rango de horario actualizado exitosamente',
            data: response
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el rango horario',
            error: error.message
        });
    }
};

// Handler para eliminar un rango de horario :
const deleteRangoHorarioHandler = async (req, res) => {

    const { id } = req.params;

    if (isNaN(id)) return res.status(400).json({ message: "El parámetro ID debe ser un entero" });

    try {
        const response = await deleteRangoHorario(id);
        if (response === 1) return res.status(404).json({ message: 'Rango de horario no encontrado', data: [] })
        if (!response) return res.status(400).json({ message: 'No se pudo eliminar el rango de horario', data: [] });
        return res.json({
            message: 'Rango de horario eliminado exitosamente',
            data: response
        });

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
    getRangosHorariosHoraHandler,
    createRangoHorarioHandler,
    deleteRangoHorarioHandler,
    updateRangoHorarioHandler,
    getAreaRangoHorarioHandler
};
