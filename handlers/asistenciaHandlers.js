const {
    getAsistenciaById,
    getAsistenciaDiaria,
    getAsistenciaRango,
    getAllAsistencias,
    createAsistencia,
    updateAsistencia
} = require('../controllers/asistenciaController');

// Handler Obtener Asistencia por Id :
const getAsistenciaByIdHandler = async (req,res) => {
    const { id } = req.params;
    if (!id){
        return res.status(400).json({ message: 'El parámetro ID es requerido' });
    }
    try {
        const asistencia = await getAsistenciaById(id);
        if(asistencia){
            return res.status(200).json({
                message: 'Asistencia obtenida correctamente',
                data: asistencia
            });
        }
        else{
            return res.status(400).json({
                message: 'La asistencia no fue encontrada para este ID',
                data: null
            });
        }
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
    const { page = 1, limit = 20 } = req.query;
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
        return res.status(500).json({
            message: "Error al obtener todas las asistencias por día en el handler",
            error: error.message
        });
    }
};

// Handler Obtener Asistencias por Rango :
const getAsistenciaRangoHandler = async (req, res) => {
    const { inicio, fin } = req.body;
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

// Handler Creación de Asistencia (SOLO ES DE PRUEBA) :
const createAsistenciaHandler = async () => {

    const { fecha, hora, estado, id_empleado, photo_id } = req.body;
    if(!fecha){
        return res.status(400).json({ message: 'El parámetro FECHA es obligatorio' });
    }
    if(!hora){
        return res.status(400).json({ message: 'El parámetro HORA es obligatorio' });
    }
    if(!estado){
        return res.status(400).json({ message: 'El parámetro ESTADO es obligatorio' });
    }
    if(!id_empleado) {
        return res.status(400).json({ message: 'El parámetro ID EMPLEADO es obligatorio' });
    }
    if(!photo_id){
        return res.status(400).json({ message: 'El parámetro PHOTO ID es obligatorio' });
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha)){
        return res.status(400).json({ message: 'El parámetro FECHA necesita el formato YYYY-MM-HH' });
    }
    if(!/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(hora)){
        return res.status(400).json({ message: 'El parámetro HORA necesita el formato HH:MM:SS.sss' });
    }
    if(!["A", "F", "DM", "DO", "V", "DF", "LSG", "LCG", "LF", "PE"].includes(estado)){
        return res.status(400).json({ message: 'El parámetro ESTADO ingresado no es el correcto' });
    }
    if(isNaN(id_empleado)){
        return res.status(400).json({ message: 'El parámetro ID EMPLEADO debe ser un entero' });
    }

    try {
        const result = await createAsistencia(fecha, hora, estado, id_empleado, photo_id);
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
}

// Handler Actualizar Asistencia :
const updateAsistenciaHandler = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    if (!id){
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
    updateAsistenciaHandler,
    createAsistenciaHandler
};
