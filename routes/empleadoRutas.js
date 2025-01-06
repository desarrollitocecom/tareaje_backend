const { Router } = require('express');
const rutas = Router();
const {
    getAllUniverseEmpleadosHandlers,
    getAllEmpleadosHandlers,
    getAllEmpleadosPagosHandler,
    getEmpleadoHandler,
    getEmpleadoPagoHandler,
    getEmpleadoByDniHandler,
    createEmpleadoHandler,
    updateEmpleadoHandler,
    updateEmpleadoPagoHandler,
    deleteEmpleadoHandler,
    findEmpleadoHandler
} = require('../handlers/empleadoHandlers');

const { saveImage, uploadImageAndPdf, multerError } = require('../utils/filesFunctions');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/all/',permisoAutorizacion(["all_system_access", "read_empleado"]), getAllUniverseEmpleadosHandlers);
rutas.get('/',permisoAutorizacion(["all_system_access", "read_empleado"]), getAllEmpleadosHandlers);
rutas.get('/pagos/', permisoAutorizacion(["all_system_access", "read_empleadoPagos"]), getAllEmpleadosPagosHandler);
rutas.get('/:id',permisoAutorizacion(["all_system_access", "read_empleado"]), getEmpleadoHandler);
rutas.get('/pagos/:id',permisoAutorizacion(["all_system_access", "read_empleadoPagos"]), getEmpleadoPagoHandler);
rutas.post('/', permisoAutorizacion(["all_system_access", "create_empleado"]), uploadImageAndPdf, multerError, createEmpleadoHandler)
rutas.get('/dni/:dni', permisoAutorizacion(["all_system_access", "read_empleado"]), getEmpleadoByDniHandler);
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_empleado"]), saveImage, multerError, updateEmpleadoHandler);
rutas.patch('/pagos/:id', permisoAutorizacion(["all_system_access", "update_empleadoPagos"]), uploadImageAndPdf, multerError, updateEmpleadoPagoHandler)
rutas.delete('/:id',permisoAutorizacion(["all_system_access", "delete_empleado"]), deleteEmpleadoHandler);
rutas.post('/find/',permisoAutorizacion(["all_system_access", "read_empleado"]), findEmpleadoHandler);

module.exports = rutas;