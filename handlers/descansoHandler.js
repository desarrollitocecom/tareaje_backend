// handlers/descansosHandler.js

const {
    getAllDescansos,
    getDescansos,
    getDescansosRango,
    createDescansos,
    deleteDescanso,
    updateDescanso
} = require("../controllers/descansoController");

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos los descansos con paginación
const getAllDescansosHandler = async (req, res) => {

    const { page = 1, limit = 20  } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllDescansos(numPage, numLimit);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if(numPage > totalPages){
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
            message: 'Descansos obtenidos exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });
        
    } catch (error) {
        console.error('Error al obtener todos los cargos en el handler', error);
        return res.status(500).json({ message: "Error al obtener todos los cargos en el handler" });
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

// Handler para obtener todos los descansos (de todo tipo) por rango de fechas :
const getDescansosRangoHandler = async (req, res) => {

    const { inicio, fin } = req.body;
    const { page = 1, limit = 20, search, subgerencia, turno, cargo, regimen, jurisdiccion, sexo, dni, state } = req.query;
    const filters = { search, subgerencia, turno, cargo, regimen, jurisdiccion, sexo, dni, state };
    const token = req.user;
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un número entero...');
    if (page < 0) errores.push('El page debe ser mayor que cero...');
    if (isNaN(limit)) errores.push('El limit debe ser un número entero...');
    if (limit <= 0) errores.push('El limit debe ser mayor que cero...');
    if (!inicio) errores.push('La fecha de inicio es obligatoria...');
    if (!fin) errores.push('La fecha de fin es obligatoria...');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio)) errores.push('El formato para INICIO es incorrecto, debe ser YYYY-MM-HH)');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fin)) errores.push('El formato para FIN es incorrecto, debe ser YYYY-MM-HH');
    if (errores.length > 0) return res.status(400).json({ errores });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getDescansosRango(numPage, numLimit, inicio, fin, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) return res.status(200).json({
            message: "Página fuera de rango...",
            data: {
                data: [],
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

        const historial = await createHistorial(
            'read',
            'Descanso',
            `Read Descansos ${inicio} to ${fin}`,
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó GetDescansosRango al historial...');

        return res.status(200).json({
            message: `Mostrando las descansos del ${inicio} al ${fin}`,
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
            message: "Error en getAsistenciaRango...",
            error: error.message
        });
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
    if (!['DL','DM','DO','DC'].includes(tipo)) errores.push('El TIPO debe ser [DM, DO, DC]');

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
    getDescansosRangoHandler,
    createDescansosHandler,
    updateDescansoHandler,
    deleteDescansoHandler
};
