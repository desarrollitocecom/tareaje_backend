// handlers/descansosHandler.js

const { getAllDescansos, getDescansos, createDescansos, deleteDescanso, updateDescanso } = require("../controllers/descansoController");

// Handler para obtener todos los descansos con paginación
const getAllDescansosHandler = async (req, res) => {
    const { page, limit } = req.query;

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

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const descanso = await getDescansos(id);
        if (!descanso) {
            return res.status(404).json({ message: "Descanso no encontrado" });
        }

        res.status(200).json(descanso);
    } catch (error) {
        console.error("Error al obtener descanso:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el descanso." });
    }
};

// Handler para crear un descanso
const createDescansosHandler = async (req, res) => {
    const { fecha, observacion, id_empleado } = req.body;

    if (!fecha || isNaN(Date.parse(fecha))) {
        return res.status(400).json({ message: "Fecha inválida" });
    }

    if (!observacion || typeof observacion !== 'string') {
        return res.status(400).json({ message: "Observación inválida" });
    }

    if (!id_empleado || isNaN(id_empleado) || id_empleado <= 0) {
        return res.status(400).json({ message: "ID de empleado inválido" });
    }

    try {
        const response = await createDescansos({ fecha, observacion, id_empleado });
        if (!response) {
            return res.status(500).json({ message: "Error al crear el descanso" });
        }

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

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    if (fecha && isNaN(Date.parse(fecha))) {
        return res.status(400).json({ message: "Fecha inválida" });
    }

    if (observacion && typeof observacion !== 'string') {
        return res.status(400).json({ message: "Observación inválida" });
    }

    if (id_empleado && (isNaN(id_empleado) || id_empleado <= 0)) {
        return res.status(400).json({ message: "ID de empleado inválido" });
    }

    try {
        const response = await updateDescanso(id, { fecha, observacion, id_empleado });
        if (!response) {
            return res.status(404).json({ message: "Descanso no encontrado para actualizar" });
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

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteDescanso(id);
        if (!response) {
            return res.status(404).json({ message: "Descanso no encontrado para eliminar" });
        }

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
