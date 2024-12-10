const { Router } = require('express');
const rutas = Router();
const {
    getAllUniverseEmpleadosHandlers,
    getAllEmpleadosHandlers,
    getEmpleadoHandler,
    createEmpleadoHandler,
    updateEmpleadoHandler,
    deleteEmpleadoHandler,
    findEmpleadoHandler
} = require('../handlers/empleadoHandlers');

const { saveImage, multerError, handlerFormData } = require('../utils/filesFunctions');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/all/',permisoAutorizacion(["all_system_access", "read_empleado"]), getAllUniverseEmpleadosHandlers);
rutas.get('/',permisoAutorizacion(["all_system_access", "read_empleado"]), getAllEmpleadosHandlers);
rutas.post('/', permisoAutorizacion(["all_system_access", "create_empleado"]), saveImage, multerError, createEmpleadoHandler);
rutas.get('/:id',permisoAutorizacion(["all_system_access", "read_empleado"]), getEmpleadoHandler);
rutas.patch('/:id',permisoAutorizacion(["all_system_access", "update_empleado"]), handlerFormData, updateEmpleadoHandler);
rutas.delete('/:id',permisoAutorizacion(["all_system_access", "delete_empleado"]), deleteEmpleadoHandler);
rutas.post('/turno/',permisoAutorizacion(["all_system_access", "read_empleado"]), findEmpleadoHandler);
module.exports = rutas;