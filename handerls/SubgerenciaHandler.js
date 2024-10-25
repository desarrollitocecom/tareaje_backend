const { createSubgerencia, getAllSubgerencias, getSubgerenciaById, updateSubgerencia, deleteSubgerencia } = require('../controllers/controllersSubgerencia');
const { check, validationResult } = require('express-validator');

// Crear una subgerencia
const handleCreateSubgerencia = async (req, res) => {
    // Validación
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio')(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre } = req.body;        

        try {
            const nuevaSubgerencia = await createSubgerencia({ nombre });
            return res.status(201).json(nuevaSubgerencia);
        } catch (error) {
            console.error("Error al crear la subgerencia:", error);
            return res.status(500).json({ error: 'Error al crear la subgerencia. Detalles: ' + error.message });
        }
    });
};



// Obtener todas las subgerencias
const handleGetAllSubgerencias = async (req, res) => {
    try {
        const subgerencias = await getAllSubgerencias();
        res.status(200).json(subgerencias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las subgerencias' });
    }
};

// Obtener una subgerencia por ID
const handleGetSubgerenciaById = async (req, res) => {
    const { id } = req.params;
    try {
        const subgerencia = await getSubgerenciaById(id);
        if (!subgerencia) {
            return res.status(404).json({ message: 'Subgerencia no encontrada' });
        }
        res.status(200).json(subgerencia);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la subgerencia' });
    }
};

// Actualizar una subgerencia
const handleUpdateSubgerencia = [
    check('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    async (req, res) => {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedSubgerencia = await updateSubgerencia(id, req.body);
            if (!updatedSubgerencia) {
                return res.status(404).json({ message: 'Subgerencia no encontrada' });
            }
            res.status(200).json(updatedSubgerencia);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la subgerencia' });
        }
    }
];

// Eliminar una subgerencia
const handleDeleteSubgerencia = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSubgerencia = await deleteSubgerencia(id);
        if (!deletedSubgerencia) {
            return res.status(404).json({ message: 'Subgerencia no encontrada' });
        }
        res.status(200).json({ message: 'Subgerencia eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la subgerencia' });
    }
};

module.exports = {
    handleCreateSubgerencia,
    handleGetAllSubgerencias,
    handleGetSubgerenciaById,
    handleUpdateSubgerencia,
    handleDeleteSubgerencia
};
