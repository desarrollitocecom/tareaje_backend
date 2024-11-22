// handlers/feriadoHandler.js

const { getAllFeriados, createFeriado, getFeriado, updateFeriado, deleteFeriado } = require("../controllers/feriadoController");
const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos los feriados con paginación
const getAllFeriadosHandler = async (req, res) => {
    const { page=1,limit=20 } = req.query;
    const errores = [];
    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page <= 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if(errores.length>0){
        return res.status(400).json({ errores });
    }

    try {
        const response = await getAllFeriados(Number(page), Number(limit));

        if(response.length === 0 || page>limit){
            return res.status(200).json(
                {message:'Ya no hay mas Feriados',
                 data:{
                    data:[],
                    totalPage:response.currentPage,
                    totalCount:response.totalCount
                 }   
                }
            );
        }
        return res.status(200).json({
            message: "Feriados obtenidos correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al obtener feriados:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los feriados." });
    }
};

// Handler para obtener un feriado por ID
const getFeriadoHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const feriado = await getFeriado(id);
        if (!feriado) {
            return res.status(404).json({ message: "Feriado no encontrado" });
        }

        res.status(200).json(feriado);
    } catch (error) {
        console.error("Error al obtener feriado:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el feriado." });
    }
};

// Handler para crear un nuevo feriado
const createFeriadoHandler = async (req, res) => {

    const { nombre, fecha } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    if (nombre.length > 255) {
        errores.push('El campo nombre no debe exceder los 255 caracteres');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre debe contener solo letras y espacios');
    }

    if (!fecha) {
        errores.push('El campo fecha es requerido');
    }
    if (isNaN(Date.parse(fecha))) {
        errores.push('El campo fecha debe estar en un formato válido (YYYY-MM-DD)');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const feriado = await createFeriado({ nombre, fecha });
        if (!feriado) {
            return res.status(500).json({ message: "Error al crear el feriado" });
        }

        const historial = await createHistorial(
            'create',
            'Feriado',
            'nombre, fecha',
            null,
            `${nombre}, ${fecha}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        res.status(201).json({
            message: "Feriado creado exitosamente",
            data: feriado
        });
    } catch (error) {
        console.error("Error al crear feriado:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el feriado.", details: error.message });
    }
};

// Handler para actualizar un feriado
const updateFeriadoHandler = async (req, res) => {

    const id = parseInt(req.params.id);
    const { nombre, fecha } = req.body;
    const token = req.user;
    const errores = [];

    if (isNaN(id) || id <= 0) {
        errores.push('El campo ID es inválido o debe ser un número positivo');
    }

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    if (nombre.length > 255) {
        errores.push('El campo nombre no debe exceder los 255 caracteres');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre debe contener solo letras y espacios');
    }

    if (!fecha) {
        errores.push('El campo fecha es requerido');
    }
    if (isNaN(Date.parse(fecha))) {
        errores.push('El campo fecha debe estar en un formato válido (YYYY-MM-DD)');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const previo = await getFeriado(id);
        const feriado = await updateFeriado(id, { nombre, fecha });
        if (!feriado) {
            return res.status(404).json({ message: "Feriado no encontrado para actualizar" });
        }

        const anterior = [previo.nombre, previo.fecha];
        const nuevo = [nombre, fecha];
        const campos = ['nombre', 'fecha'];
        let historial;

        for (let i = 0; i < anterior.length; i++) {
            if (anterior[i] !== nuevo[i]) {
                historial = await createHistorial(
                    'update',
                    'Feriado',
                    campos[i],
                    anterior[i],
                    nuevo[i],
                    token
                );
                if (!historial) console.warn('No se agregó al historial...');
            }
        }

        res.status(200).json({
            message: "Feriado actualizado correctamente",
            data: feriado
        });
    } catch (error) {
        console.error("Error al actualizar feriado:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el feriado.", details: error.message });
    }
};

// Handler para eliminar (cambiar el estado) de un feriado
const deleteFeriadoHandler = async (req, res) => {

    const id = parseInt(req.params.id);
    const token = req.user;

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const feriado = await deleteFeriado(id);
        if (!feriado) {
            return res.status(404).json({ message: "Feriado no encontrado para eliminar" });
        }

        const historial = await createHistorial(
            'delete',
            'Feriado',
            'nombre, fecha',
            `${feriado.nombre}, ${feriado.fecha}`,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        res.status(200).json({
            message: "Feriado eliminado exitosamente",
            data: feriado
        });
    } catch (error) {
        console.error("Error al eliminar feriado:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el feriado." });
    }
};

module.exports = {
    getAllFeriadosHandler,
    getFeriadoHandler,
    createFeriadoHandler,
    updateFeriadoHandler,
    deleteFeriadoHandler
};
