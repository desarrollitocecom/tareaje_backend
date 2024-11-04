// handlers/feriadoHandler.js

const { getAllFeriados, createFeriado, getFeriado, updateFeriado, deleteFeriado } = require("../controllers/feriadoController");

// Handler para obtener todos los feriados con paginación
const getAllFeriadosHandler = async (req, res) => {
    const { page=1,limit=20 } = req.query;
    if (isNaN(page) || page <= 0) {
        return res.status(400).json({ message: "El page debe ser un numero" });
    }
    if (isNaN(limit) || limit <= 0) {
        return res.status(400).json({ message: "El limit debe ser un numero" });
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

    // Validar nombre
    if (!nombre || typeof nombre !== 'string' || nombre.length > 255) {
        return res.status(400).json({ message: "Nombre inválido o demasiado largo" });
    }

    // Validar fecha en formato YYYY-MM-DD
    if (!fecha || isNaN(Date.parse(fecha))) {
        return res.status(400).json({ message: "Fecha inválida" });
    }

    try {
        const feriado = await createFeriado({ nombre, fecha });
        if (!feriado) {
            return res.status(500).json({ message: "Error al crear el feriado" });
        }

        res.status(201).json({
            message: "Feriado creado exitosamente",
            data: feriado
        });
    } catch (error) {
        console.error("Error al crear feriado:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el feriado." });
    }
};

// Handler para actualizar un feriado
const updateFeriadoHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, fecha } = req.body;

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    if (nombre && (typeof nombre !== 'string' || nombre.length > 255)) {
        return res.status(400).json({ message: "Nombre inválido o demasiado largo" });
    }

    if (fecha && isNaN(Date.parse(fecha))) {
        return res.status(400).json({ message: "Fecha inválida" });
    }

    try {
        const feriado = await updateFeriado(id, { nombre, fecha });
        if (!feriado) {
            return res.status(404).json({ message: "Feriado no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "Feriado actualizado correctamente",
            data: feriado
        });
    } catch (error) {
        console.error("Error al actualizar feriado:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el feriado." });
    }
};

// Handler para eliminar (cambiar el estado) de un feriado
const deleteFeriadoHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const feriado = await deleteFeriado(id);
        if (!feriado) {
            return res.status(404).json({ message: "Feriado no encontrado para eliminar" });
        }

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
