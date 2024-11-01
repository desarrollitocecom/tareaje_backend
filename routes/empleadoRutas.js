const { Router } = require('express');
const rutas = Router();
const {
    getAllEmpleadosHandlers,
    getEmpleadoHandler,
    createEmpleadoHandler,
    updateEmpleadoHandler,
    deleteEmpleadoHandler
} = require('../handlers/empleadoHandlers');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/', permisoAutorizacion(["all_system_access", "read_empleado"]), getAllEmpleadosHandlers);
rutas.post('/', permisoAutorizacion(["all_system_access", "create_empleado"]), createEmpleadoHandler);
rutas.get('/:id', permisoAutorizacion(["all_system_access", "read_empleado"]), getEmpleadoHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_empleado"]), updateEmpleadoHandler);
rutas.delete('/:id', permisoAutorizacion(["all_system_access", "delete_empleado"]), deleteEmpleadoHandler);
module.exports = rutas;