const {
    getAsistenciaById,
    getAsistenciaDiaria,
    getAsistenciaRango,
    getAllAsistencias,
    updateAsistencia
} = require('../controllers/asistenciaController');

// Handler Obtener Asistencia por Id :
const getAsistenciaByIdHandler = async (req,res) => {
    const { id } = req.params;
    if (!id || isNaN(id)){
        return res.status(400).json({ message: 'El parámetro ID es requerido y debe ser un Integer' });
    }
    try {
        const data = await getAsistenciaById(id);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener la asistencia de esa persona',
            error: error.message
        });
    }
};

// Handler Obtener Asistencias por Fecha :
const getAsistenciaDiariaHandler = async (req, res) => {
    const { fecha } = req.params;
    const { page=1, limit=20 } = req.query;
    const errores = [];
    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page <= 0) errores.push('El page debe ser un entero mayor a cero');
    if (isNaN(limit)) errores.push('El limit debe ser un entero');
    if (limit <= 0) errores.push('El limit debe ser un entero mayor a cero');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.push('El formato para el parámetro FECHA es incorrecto');
    if(errores.length > 0){
        return res.status(400).json({ errores });
    }
    try {
        const response = await getAsistenciaDiaria(Number(page), Number(limit), fecha);
        if(response.length === 0 || page > limit){
            return res.status(200).json({ 
                message:'No hay más asistencias...',
                data:{
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }   
            });
        }
        return res.status(200).json({
            message: 'Mostrando asistencias...',
            data: response
        });
        
    } catch (error) {
        console.error('Error al obtener todas las asistencias por día en el handler', error);
        return res.status(500).json({ message: "Error al obtener todas las asistencias por día en el handler" });
    }
};

// Handler Obtener Asistencias por Rango :
const getAsistenciaRangoHandler = async (req, res) => {
    const { inicio, fin } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page <= 0) errores.push('El page debe ser un entero mayor a cero');
    if (isNaN(limit)) errores.push('El limit debe ser un entero');
    if (limit <= 0) errores.push('El limit debe ser un entero mayor a cero');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio)) errores.push('El formato para el parámetro INICIO es incorrecto');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fin)) errores.push('El formato para el parámetro FIN es incorrecto');
    if(errores.length > 0){
        return res.status(400).json({ errores });
    }
    try {
        const response = await getAsistenciaRango(Number(page), Number(limit), inicio, fin);
        if(response.length === 0 || page > limit){
            return res.status(200).json({ 
                message:'No hay más asistencias en este rango...',
                data:{
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }   
            });
        }
        return res.status(200).json({
            message: 'Mostrando asistencias en este rango...',
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener todas las asistencias por día en el handler' });
    }
};

// Handler Obtener todas las Asistencias :
const getAllAsistenciasHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
    if (isNaN(page)) errores.push('El page debe ser un entero');
    if (page <= 0) errores.push('El page debe ser un entero mayor a cero');
    if (isNaN(limit)) errores.push('El limit debe ser un entero');
    if (limit <= 0) errores.push('El limit debe ser un entero mayor a cero');
    if(errores.length > 0){
        return res.status(400).json({ errores });
    }
    try {
        const response = await getAllAsistencias(Number(page), Number(limit));
        if(response.length === 0 || page > limit){
            return res.status(200).json({ 
                message:'No hay más asistencias en este rango...',
                data:{
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }   
            });
        }
        return res.status(200).json({
            message: 'Mostrando asistencias en este rango...',
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener todas las asistencias por día en el handler' });
    }
};

// Handler Actualizar Asistencia :
const updateAsistenciaHandler = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    if (!id || isNaN(id)){
        return res.status(400).json({ message: 'El parámetro ID es requerido y debe ser un entero' });
    }
    if (!estado) {
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
    getAsistenciaByIdHandler,
    getAsistenciaDiariaHandler,
    getAsistenciaRangoHandler,
    getAllAsistenciasHandler,
    updateAsistenciaHandler
};
