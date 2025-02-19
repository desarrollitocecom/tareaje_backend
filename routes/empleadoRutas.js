const { Router } = require('express');
const rutas = Router();

const {
    getAllUniverseEmpleadosHandlers,
    getAllEmpleadosHandlers,
    getAllEmpleadosPagosHandler,
    getEmpleadoHandler,
    getEmpleadoPagoHandler,
    getEmpleadoByDniHandler,
    getTurnoByDniHandler,
    createEmpleadoHandler,
    createEmpleadoPagoHandler,
    createEmpleadoOnlyInfoHandler,
    updateEmpleadoHandler,
    updateEmpleadoPagoHandler,
    updateEmpleadoOnlyInfoHandler,
    updateEmpleadoInfoPagoHandler,
    deleteEmpleadoHandler,
    findEmpleadoHandler,
    blackDeleteHandler,
    fechaEmpleadoHandler
} = require('../handlers/empleadoHandlers');

const { saveImage, uploadImageAndPdf, multerError } = require('../utils/filesFunctions');
const permisoAutorizacion = require("../checkers/roleAuth");

rutas.get('/all/',permisoAutorizacion(["all_system_access", "read_empleado"]), getAllUniverseEmpleadosHandlers);
rutas.get('/',permisoAutorizacion(["all_system_access", "read_empleado"]), getAllEmpleadosHandlers);
rutas.get('/pagos/', permisoAutorizacion(["all_system_access", "read_empleadoPagos"]), getAllEmpleadosPagosHandler);
rutas.get('/:id',permisoAutorizacion(["all_system_access", "read_empleado"]), getEmpleadoHandler);
rutas.get('/pagos/:id',permisoAutorizacion(["all_system_access", "read_empleadoPagos"]), getEmpleadoPagoHandler);
rutas.get('/dni/:dni', permisoAutorizacion(["all_system_access", "read_empleado"]), getEmpleadoByDniHandler);
rutas.get('/turno/:dni', permisoAutorizacion(["all_system_access", "read_empleadoturno"]), getTurnoByDniHandler);
rutas.post('/', permisoAutorizacion(["all_system_access", "create_empleado"]), saveImage, multerError, createEmpleadoHandler);
rutas.post('/only/create/', permisoAutorizacion(["all_system_access", "create_empleado"]), createEmpleadoOnlyInfoHandler);
rutas.post('/pagos/', permisoAutorizacion(["all_system_access", "create_empleadoPagos"]), uploadImageAndPdf, multerError, createEmpleadoPagoHandler)
rutas.patch('/:id', permisoAutorizacion(["all_system_access", "update_empleado"]), saveImage, multerError, updateEmpleadoHandler);
rutas.patch('/pagos/:id', permisoAutorizacion(["all_system_access", "update_empleadoPagos"]), uploadImageAndPdf, multerError, updateEmpleadoPagoHandler);
rutas.patch('/only/update/:id', permisoAutorizacion(["all_system_access", "update_empleadoPagos"]), updateEmpleadoOnlyInfoHandler);
rutas.patch('/only/pago/:id', permisoAutorizacion(["all_system_access", "update_empleadoPagos"]), updateEmpleadoInfoPagoHandler);
rutas.delete('/:id',permisoAutorizacion(["all_system_access", "delete_empleado"]), deleteEmpleadoHandler);
rutas.post('/find/',permisoAutorizacion(["all_system_access", "read_empleado"]), findEmpleadoHandler);
rutas.delete('/black/:id',permisoAutorizacion(["all_system_access", "delete_empleado"]), blackDeleteHandler);
rutas.post('/cambios/', permisoAutorizacion(["all_system_access"]), fechaEmpleadoHandler);

module.exports = rutas;