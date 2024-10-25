const { Router } = require('express');
const rutas = Router();

const {
    handleCreateSubgerencia,
    handleGetAllSubgerencias,
    handleGetSubgerenciaById,
    handleUpdateSubgerencia,
    handleDeleteSubgerencia
} = require('../handerls/SubgerenciaHandler'); // Asegúrate de que la ruta esté correcta

// Definir las rutas para CRUD de Subgerencia
rutas.post('/crear', handleCreateSubgerencia);      // Crear subgerencia
rutas.get('/subgerencias', handleGetAllSubgerencias);      // Obtener todas las subgerencias
rutas.get('/subgerencias/:id', handleGetSubgerenciaById);  // Obtener una subgerencia por ID
rutas.put('/subgerencias/:id', handleUpdateSubgerencia);   // Actualizar una subgerencia por ID
rutas.delete('/borrarSubgerencias/:id', handleDeleteSubgerencia); // Eliminar una subgerencia por ID

module.exports = rutas;
