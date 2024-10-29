    const { Router } = require('express');
    const rutas = Router();
    const {
        getAllEmpleadosHandlers,
        getEmpleadoHandler,
        createEmpleadoHandler,
        updateEmpleadoHandler,
        deleteEmpleadoHandler
    
    } = require('../handlers/empleadoHandlers');

    rutas.get('/', getAllEmpleadosHandlers);
    rutas.post('/',createEmpleadoHandler);
    rutas.get('/:id',getEmpleadoHandler);
    rutas.patch('/:id',updateEmpleadoHandler);
    rutas.delete('/:id',deleteEmpleadoHandler)


module.exports = rutas;