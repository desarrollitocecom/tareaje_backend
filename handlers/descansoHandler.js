// handlers/descansosHandler.js

const { getAllDescansos, getDescansos, createDescansos, deleteDescanso, updateDescanso } = require("../controllers/descansoController");
const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos los descansos con paginación
const getAllDescansosHandler = async (req, res) => {

    const { page=1,limit=20 } = req.query;
    const token = req.user;
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page <= 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if(errores.length>0){
        return res.status(400).json({ errores });
    }

    try {
        const response = await getAllDescansos(Number(page) || 1, Number(limit) || 20);
        
        if(response.length === 0 || page>limit){
            return res.status(200).json(
                {message:'Ya no hay mas descansos',
                 data:{
                    data:[],
                    totalPage:response.currentPage,
                    totalCount:response.totalCount
                 }   
                }
            );
        }

        const historial = await createHistorial(
            'read',
            'Descanso',
            'Read All Descansos',
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: "Descansos obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener descansos:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los descansos." });
    }
};


// Handler para obtener un descanso por ID
const getDescansosHandler = async (req, res) => {

    const id = parseInt(req.params.id);
    const token = req.user;

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const descanso = await getDescansos(id);
        if (!descanso) {
            return res.status(404).json({ message: "Descanso no encontrado" });
        }

        const historial = await createHistorial(
            'read',
            'Descanso',
            `Read Descanso Id ${id}`,
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json(descanso);
    } catch (error) {
        console.error("Error al obtener descanso:", error);
        return res.status(500).json({ error: "Error interno del servidor al obtener el descanso." });
    }
};

// Handler para crear un descanso
const createDescansosHandler = async (req, res) => {

    const { fecha, tipo, observacion, id_empleado } = req.body;
    const token = req.user;
    const errores = [];

    if (!fecha) {
        errores.push('El campo fecha es requerido');
    } 
    if (isNaN(Date.parse(fecha))) {
        errores.push('El campo fecha debe estar en un formato válido (YYYY-MM-DD)');
    }

    if (!tipo) errores.push('El parámetro TIPO es obligatorio');
    if (!['DM','DO','DC'].includes(tipo)) errores.push('El TIPO debe ser [DM, DO, DC]');

    if (!observacion) {
        errores.push('El campo observación es requerido');
    } 
    
    if (typeof observacion !== 'string') {
        errores.push('El campo observación debe ser una cadena de texto');
    }

    if (!id_empleado) {
        errores.push('El campo ID de empleado es requerido');
    } 
    if (isNaN(id_empleado) || id_empleado <= 0) {
        errores.push('El campo ID de empleado debe ser un número positivo');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }
    try {
        const response = await createDescansos({ fecha, tipo, observacion, id_empleado });
        if (!response) {
            return res.status(500).json({ message: "Error al crear el descanso" });
        }

        const historial = await createHistorial(
            'create',
            'Descanso',
            'fecha, tipo, observacion, id_empleado',
            null,
            `${fecha}, ${tipo}, ${observacion}, ${id_empleado}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        res.status(201).json({
            message: "Descanso creado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear descanso:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el descanso." });
    }
};

// Handler para actualizar un descanso
const updateDescansoHandler = async (req, res) => {

    const id = parseInt(req.params.id);
    const { fecha, observacion, id_empleado } = req.body;
    const token = req.user;
    const errores = [];

    if (isNaN(id) || id <= 0) {
        errores.push('El campo ID es inválido o debe ser un número positivo');
    }

    if (!fecha) {
        errores.push('El campo fecha es requerido');
    } 
    if (isNaN(Date.parse(fecha))) {
        errores.push('El campo fecha debe estar en un formato válido (YYYY-MM-DD)');
    }

    if (!observacion) {
        errores.push('El campo observación es requerido');
    } 
    if (typeof observacion !== 'string') {
        errores.push('El campo observación debe ser una cadena de texto');
    }

    if (!id_empleado) {
        errores.push('El campo ID de empleado es requerido');
    } 
    if (isNaN(id_empleado) || id_empleado <= 0) {
        errores.push('El campo ID de empleado debe ser un número positivo');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const previo = await getDescansos(id);
        const response = await updateDescanso(id, { fecha, observacion, id_empleado });
        if (!response) {
            return res.status(404).json({ message: "Descanso no encontrado para actualizar" });
        }

        const anterior = [previo.fecha, previo.observacion, previo.id_empleado];
        const nuevo = [fecha, observacion, id_empleado];
        const campos = ['fecha', 'observacion', 'id_empleado'];
        let historial;

        for (let i = 0; i < anterior.length; i++) {
            if (anterior[i] !== nuevo[i]) {
                historial = await createHistorial(
                    'update',
                    'Descanso',
                    campos[i],
                    anterior[i],
                    nuevo[i],
                    token
                );
                if (!historial) console.warn('No se agregó al historial...');
            }
        }

        res.status(200).json({
            message: "Descanso actualizado correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar descanso:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el descanso." });
    }
};

// Handler para eliminar un descanso (cambia el estado a false)
const deleteDescansoHandler = async (req, res) => {

    const id = parseInt(req.params.id);
    const token = req.user;

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteDescanso(id);
        if (!response) {
            return res.status(404).json({ message: "Descanso no encontrado para eliminar" });
        }

        const historial = await createHistorial(
            'delete',
            'Descanso',
            'fecha, observacion, id_empleado',
            `${response.fecha}, ${response.observacion}, ${response.id_empleado}`,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        res.status(200).json({
            message: "Descanso eliminado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar descanso:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el descanso." });
    }
};

module.exports = {
    getAllDescansosHandler,
    getDescansosHandler,
    createDescansosHandler,
    updateDescansoHandler,
    deleteDescansoHandler
};
