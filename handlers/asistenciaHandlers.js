const {
    getAsistenciaById,
    getAsistenciaDiaria,
    getAsistenciaRango,
    getAllAsistencias,
    createAsistenciaUsuario,
    filtroAsistenciaDiaria
} = require('../controllers/asistenciaController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener asistencia por id :
const getAsistenciaByIdHandler = async (req,res) => {

    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'El parámetro ID es requerido' });
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)){
        return res.status(400).json({ message: 'El parámetro ID debe ser de tipo UUID' });
    }
    
    try {
        const asistencia = await getAsistenciaById(id);
        if(!asistencia){
            return res.status(400).json({
                message: 'La asistencia no fue encontrada para este ID',
                data: []
            });
        }

        return res.status(200).json({
            message: 'Asistencia obtenida correctamente',
            data: asistencia
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en getAsistenciaById...',
            error: error.message
        });
    }
};

// Handler para obtener asistencias (todos los estados) por fecha :
const getAsistenciaDiariaHandler = async (req, res) => {

    const { fecha } = req.params;
    const { page = 1, pageSize = 20 } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page <= 0) errores.push('El page debe ser un entero mayor a cero');
    if (isNaN(pageSize)) errores.push('El limit debe ser un entero');
    if (pageSize <= 0) errores.push('El limit debe ser un entero mayor a cero');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.push('El formato para fecha es incorrecto, cumplir con YYYY-MM-HH');
    if (errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await getAsistenciaDiaria(page, pageSize, fecha);
        const totalPages = Math.ceil(response.totalCount / pageSize)

        if(page > pageSize){
            return res.status(404).json({ 
                message:'Página fuera de rango...',
                data:{
                    data: [],
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: response.totalCount
                }   
            });
        }

        return res.status(200).json({
            message: `Mostrando las asistencias del día ${fecha}`,
            data: response.data,
            currentPage: page,
            totalPages: totalPages,
            totalCount: response.totalCount
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Error en getAsistenciaDiaria...",
            error: error.message
        });
    }
};

// Handler para obtener asistencias (todos los estados) por rango de fechas :
const getAsistenciaRangoHandler = async (req, res) => {

    const { inicio, fin } = req.body;
    const { page = 1, pageSize = 20 } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page <= 0) errores.push('El page debe ser un entero mayor a cero');
    if (isNaN(pageSize)) errores.push('El limit debe ser un entero');
    if (pageSize <= 0) errores.push('El limit debe ser un entero mayor a cero');
    if (!inicio) errores.push('El parámetro INICIO es obligatorio');
    if (!fin) errores.push('El parámetro FIN es obligatorio')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio)) errores.push('El formato para INICIO es incorrecto, debe ser YYYY-MM-HH)');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fin)) errores.push('El formato para FIN es incorrecto, debe ser YYYY-MM-HH');
    if(errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await getAsistenciaRango(page, pageSize, inicio, fin);
        const totalPages = Math.ceil(response.totalCount / pageSize);

        if(page > pageSize){
            return res.status(404).json({ 
                message:'Página fuera de rango...',
                data:{
                    data: [],
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: response.totalCount
                }   
            });
        }

        return res.status(200).json({
            message: `Mostrando las asistencias del ${inicio} al ${fin}`,
            data: response.data,
            currentPage: page,
            totalPages: totalPages,
            totalCount: response.totalCount
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en getAsistenciaRango',
            error: error.message
        });
    }
};

// Handler para obtener todas las asistencias :
const getAllAsistenciasHandler = async (req, res) => {

    const { page = 1, pageSize = 20 } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page <= 0) errores.push('El page debe ser un entero mayor a cero');
    if (isNaN(pageSize)) errores.push('El limit debe ser un entero');
    if (pageSize <= 0) errores.push('El limit debe ser un entero mayor a cero');
    if(errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await getAllAsistencias(page, pageSize);
        const totalPages = Math.ceil(response.totalCount / pageSize);

        if(page > pageSize){
            return res.status(404).json({ 
                message:'Página fuera de rango...',
                data:{
                    data: [],
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: response.totalCount
                }   
            });
        }

        return res.status(200).json({
            message: 'Mostrando las asistencias...',
            data: response.data,
            currentPage: page,
            totalPages: totalPages,
            totalCount: response.totalCount
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en getAllAsistencias',
            error: error.message
        });
    }
};

// Handler Creación de Asistencia (SOLO ES DE PRUEBA) :
const createAsistenciaUsuarioHandler = async (req, res) => {

    const { fecha, hora, estado, id_empleado } = req.body;
    const token = req.user;
    const errores = [];

    if(!fecha) errores.push('El parámetro FECHA es obligatorio');
    if(!hora) errores.push('El parámetro HORA es obligatorio');
    if(!estado) errores.push('El parámetro ESTADO es obligatorio');
    if(!id_empleado) errores.push('El parámetro ID EMPLEADO es obligatorio');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.push('El parámetro FECHA necesita el formato YYYY-MM-HH');
    if(!/^\d{2}:\d{2}:\d{2}$/.test(hora)) errores.push('El parámetro HORA necesita el formato HH:MM:SS');
    if(!["A", "F", "DM", "DO", "V", "DF", "LSG", "LCG", "LF", "PE"].includes(estado)) {
        errores.push('El parámetro ESTADO no es correcto, debe ser [A, F, DM, DO, V, DF, LSG, LCG, LF, PE]');
    }
    if(isNaN(id_empleado)) errores.push('El parámetro ID EMPLEADO debe ser un entero');
    if(errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await createAsistenciaUsuario(fecha, hora, estado, id_empleado);
        if (!response) {
            return res.status(400).json({
                message: 'No se pudo crear la asistencia...',
                data: []
            });
        }

        if(response === 1){
            return res.status(400).json({
                message: 'La asistencia ya fue creada, no se puede sobrescribir',
                data: []
            });
        }

        const historial = await createHistorial(
            'create',
            'Asistencia',
            'fecha, hora, estado, id_empleado',
            null,
            `${fecha}, ${hora}, ${estado}, ${id_empleado}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Asistencia creada con éxito...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en createAsistenciaUsuario',
            error: error.message
        });
    }
}

// Handler para filtrar solo asistencias por fecha :
const filtroAsistenciaDiariaHandler = async (req, res) => {

    const { fecha } = req.params;
    const { page = 1, pageSize = 20 } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page <= 0) errores.push('El page debe ser un entero mayor a cero');
    if (isNaN(pageSize)) errores.push('El limit debe ser un entero');
    if (pageSize <= 0) errores.push('El limit debe ser un entero mayor a cero');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.push('El formato para fecha es incorrecto, cumplir con YYYY-MM-HH');
    if (errores.length > 0) return res.status(400).json({ errores });

    try {
        const response = await filtroAsistenciaDiaria(page, pageSize, fecha);
        const totalPages = Math.ceil(response.totalCount / pageSize)

        if(page > pageSize){
            return res.status(404).json({ 
                message:'Página fuera de rango...',
                data:{
                    data: [],
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: response.totalCount
                }   
            });
        }

        return res.status(200).json({
            message: `Mostrando las asistencias del día ${fecha}`,
            data: response.data,
            currentPage: page,
            totalPages: totalPages,
            totalCount: response.totalCount
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Error en filtroAsistenciaDiaria...",
            error: error.message
        });
    }
};

module.exports = {
    getAsistenciaByIdHandler,
    getAsistenciaDiariaHandler,
    getAsistenciaRangoHandler,
    getAllAsistenciasHandler,
    createAsistenciaUsuarioHandler,
    filtroAsistenciaDiariaHandler
};
