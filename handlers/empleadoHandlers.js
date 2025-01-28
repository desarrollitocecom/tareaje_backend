const {
    getAllUniverseEmpleados,
    getAllEmpleados,
    getAllEmpleadosPagos,
    getEmpleado,
    getEmpleadoPago,
    getEmpleadoByDni,
    createEmpleado,
    updateEmpleado,
    updateEmpleadoPago,
    deleteEmpleado,
    deleteEmpleadoBlackList,
    fechaEmpleado,
    findEmpleado,
    getEmpleadoById
} = require('../controllers/empleadoController');

const { createHistorial } = require('../controllers/historialController');
const { createPerson } = require('../controllers/axxonController');
const { deletePhoto, deletePdfDNI } = require('../utils/filesFunctions');
const { readPerson } = require('../controllers/axxonController');
const { validateBlackList } = require('../controllers/blackListController');
const fs = require('fs');
const path = require('path');

// Handler para obtener todos los empleados con la información de la DB de Tareaje (OPCIONAL) :
const getAllUniverseEmpleadosHandlers = async (req, res) => {

    try {
        const response = await getAllUniverseEmpleados();
        if (!response) {
            return res.status(200).json({
                message: 'No se obtuvieron los empleados...',
                data: {
                    data: [],
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Todos los empleados obtenidos correctamente...",
            data: response,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error interno al obtener todos los empleados absolutos',
            error: error.message
        });
    }
};

// Handler para obtener todos los empleados sin incluir datos privados (SECTOR TAREAJE) :
const getAllEmpleadosHandlers = async (req, res) => {

    const { page = 1, limit = 20, search, subgerencia, turno, cargo, regimen, lugar, jurisdiccion, grado, sexo, area, dni, state, edadMin, edadMax, hijosMin, hijosMax } = req.query;
    const filters = { search, subgerencia, turno, cargo, regimen, lugar, jurisdiccion, grado, sexo, area, dni, state,edadMin, edadMax, hijosMin, hijosMax };
    const errores = [];
    // console.log("page: ", page);

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllEmpleados(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if(numPage > totalPages){
            return res.status(200).json({
                message:'Página fuera de rango...',
                data:{
                    data: [],
                    currentPage: numPage,
                    pageCount: response.data.length,
                    totalCount: response.totalCount,
                    totalPages: totalPages,
                }
            });
        }

        return res.status(200).json({
            message: 'Empleados obtenidos exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error interno al obtener todos los empleados',
            error: error.message
        });
    }
};

// Handler para obtener toda la información de los empleados, incluido datos privados (SECTOR PAGOS) :
const getAllEmpleadosPagosHandler = async (req, res) => {

    const { page = 1, limit = 20, search, subgerencia, turno, cargo, regimen, jurisdiccion, sexo, area, dni, state, edadMin, edadMax, hijosMin, hijosMax } = req.query;
    const filters = { search, subgerencia, turno, cargo, regimen, jurisdiccion, sexo, area, dni, state,edadMin, edadMax, hijosMin, hijosMax };
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if (errores.length > 0) return res.status(400).json({ message: "Se encontraron los siguentes errores:", data: errores });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllEmpleadosPagos(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if(numPage > totalPages){
            return res.status(200).json({
                message:'Página fuera de rango...',
                data:{
                    data: [],
                    currentPage: numPage,
                    pageCount: response.data.length,
                    totalCount: response.totalCount,
                    totalPages: totalPages,
                }
            });
        }

        return res.status(200).json({
            message: 'Empleados obtenidos exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error interno al obtener todos los empleados para el sector de pagos',
            error: error.message
        });
    }
}

// Handler para obtener la información del empleado sin incluir datos privados (SECTOR TAREAJE) :
const getEmpleadoHandler = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(id)) return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });

    try {
        const response = await getEmpleado(id);
        if (!response) {
            return res.status(200).json({
                message: 'No se encuentra el empleado',
                data: []
            })
        };

        return res.status(200).json({
            message: 'Empleado encontrado exitosamente...',
            data: response,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error interno al obtener el empleado por ID',
            error: error.message
        });
    }
};

// Handler para obtener la información del empleado incluidos datos privados (SECTOR PAGOS) :
const getEmpleadoPagoHandler = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(id)) return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });

    try {
        const response = await getEmpleadoPago(id);
        if (!response) {
            return res.status(200).json({
                message: 'No se encuentra el empleado',
                data: []
            })
        };

        return res.status(200).json({
            message: 'Empleado encontrado exitosamente...',
            data: response,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error interno al obtener el empleado por ID para el sector de pagos',
            error: error.message
        });
    }
};

// Handler para obtener información básica del empleado por medio del DNI :
const getEmpleadoByDniHandler = async (req, res) => {
    
    const { dni } = req.params;
    const errores = [];

    if (!dni) errores.push('El DNI es un parámetro obligatorio');
    if (!/^\d{8}$/.test(dni)) errores.push("El DNI debe tener exactamente 8 dígitos");
    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    try {
        const response = await getEmpleadoByDni(dni);
        if (!response) {
            return res.status(200).json({
                message: "Empleado no identificado en la base de datos...",
                data: []
            });
        }
        return res.status(200).json({
            message: "Empleado identificado en la base de datos...",
            data: response
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error interno al obtener información básica del empleado por DNI',
            error: error.message
        });
    }
};

// Handler para crear al empleado sin información privada :
const createEmpleadoHandler = async (req, res) => {

    const {
        nombres, apellidos, dni, ruc, hijos, edad,
        f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, carrera,
        id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
        id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area
    } = req.body;

    const token = req.user;
    const errores = [];

    // Validaciones para aceptar campos nulos :
    const config_correo = (correo) ? correo : null;
    const config_domicilio = (domicilio) ? domicilio : null;
    const config_celular = (celular) ? celular : null;
    const config_f_inicio = (f_inicio) ? f_inicio : null;
    const config_observaciones = (observaciones) ? observaciones : null;
    const config_carrera = (carrera) ? carrera : null;

    // Validaciones necesarias :
    if (!req.file) errores.push('Es obligatorio el envío de la foto');
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(nombres)) errores.push("Los nombres deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(apellidos)) errores.push("Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^\d{8}$/.test(dni)) errores.push("DNI debe tener exactamente 8 dígitos");
    if (!/^\d{11}$/.test(ruc) && (ruc && ruc !== 'NO TIENE RUC')) errores.push("RUC debe tener exactamente 11 dígitos");
    if (isNaN(hijos)) errores.push("El número de hijos debe ser un número entero mayor o igual a 0");
    if (isNaN(edad) || edad < 0 || edad > 120) errores.push("La edad debe ser un entero entre 0 y 120");
    if (!Date.parse(f_nacimiento)) errores.push("La fecha de nacimiento debe tener el formato YYYY-MM-DD");
    if (config_correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config_correo)) errores.push("El correo electrónico no es válido");
    if (config_domicilio && config_domicilio.length < 5) errores.push("El domicilio debe tener al menos 5 caracteres");
    if (config_celular && !/^\d{9}$/.test(config_celular)) errores.push("El número de celular debe tener entre 9 y 15 dígitos");
    if (config_f_inicio && !Date.parse(config_f_inicio)) errores.push("La fecha de inicio debe tener el formato YYYY-MM-DD");
    if (config_observaciones && config_observaciones.length > 200) errores.push("Las observaciones no pueden exceder 200 caracteres"); 
    if (!id_cargo || isNaN(id_cargo)) errores.push('El ID de cargo es requerido y debe ser un entero');
    if (!id_turno || isNaN(id_turno)) errores.push('El ID de turno es requerido y debe ser un entero');
    if (!id_regimen_laboral || isNaN(id_regimen_laboral)) errores.push('El ID de régimen laboral es requerido y debe ser un entero');
    if (!id_sexo || isNaN(id_sexo)) errores.push('El ID de sexo es requerido y debe ser un entero');
    if (!id_jurisdiccion || isNaN(id_jurisdiccion)) errores.push('El ID de jurisdicción es requerido y debe ser un entero');
    if (!id_grado_estudios || isNaN(id_grado_estudios)) errores.push('El ID de grado de estudios es requerido y debe ser un entero');
    if (!id_subgerencia || isNaN(id_subgerencia)) errores.push('El ID de subgerencia es requerido y debe ser un entero');
    if (!id_funcion || isNaN(id_funcion)) errores.push('El ID de función es requerido y debe ser un entero');
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo)) errores.push('El ID de lugar de trabajo es requerido y debe ser un entero');
    if (!id_area || isNaN(id_area)) errores.push('El ID de área es requerido y debe ser un entero');

    if (errores.length > 0) {
        if (req.file) await deletePhoto(req.file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
        // Validar si la personaa no pertenece a la Black List :
        const dark = await validateBlackList(nombres, apellidos, dni);
        if (dark) {
            await deletePhoto(req.file.filename);
            return res.status(400).json({
                message: 'La persona pertenece a la Black List, no puede laborar',
                data: []
            });
        }

        // Guardar en AXXON la imagen en base 64 :
        const savedPath = path.join('uploads', 'fotos', req.file.filename).replace(/\\/g, '/');
        const fileBuffer = fs.readFileSync(req.file.path);
        const fileBase64 = fileBuffer.toString('base64');
        const consulta = await createPerson(nombres, apellidos, dni, String(id_funcion), String(id_turno), fileBase64);
        if (!consulta) {
            await deletePhoto(req.file.filename);
            return res.status(400).json({
                message: 'La foto necesariamente debe mostrar el rostro de la persona nítidamente...',
                data: []
            });
        }

        const carasDni = 'Sin Pdf';
        const cci = 'No Definido';
        const certiAdulto = null;
        const claveSol = null;
        const suspension = 'No Definido';

        const response = await createEmpleado(
            nombres, apellidos, dni, ruc, hijos, edad, f_nacimiento,
            config_correo, config_domicilio, config_celular, config_f_inicio, savedPath, config_observaciones, config_carrera,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area,
            carasDni, cci, certiAdulto, claveSol, suspension
        );

        if (!response) {
            await deletePhoto(req.file.filename);
            return res.status(200).json({
                message: 'No se pudo crear al empleado',
                data: []
            });
        }

        // Registro en el historial :
        const historial = await createHistorial('create', 'Empleado', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del empleado con DNI ${dni} al historial`);

        // Creación exitosa del empleado :
        return res.status(200).json({
            message: 'Empleado creado exitosamente...',
            data: response
        });

    } catch (error) {
        if (req.file) await deletePhoto(req.file.filename);
        res.status(500).json({
            message: 'Error interno al crear al empleado',
            error: error.message
        });
    }
};

// Handler para crear al empleado con toda la información (SECTOR TAREAJE Y PAGOS) :
const createEmpleadoPagoHandler = async (req, res) => {

    const {
        nombres, apellidos, dni, ruc, hijos, edad,
        f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, carrera,
        id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
        id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area,
        cci, certiAdulto, claveSol, suspension
    } = req.body;

    const token = req.user;
    const errores = [];

    // Validaciones para aceptar campos nulos :
    const config_correo = (correo) ? correo : null;
    const config_domicilio = (domicilio) ? domicilio : null;
    const config_celular = (celular) ? celular : null;
    const config_f_inicio = (f_inicio) ? f_inicio : null;
    const config_observaciones = (observaciones) ? observaciones : null;
    const config_carrera = (carrera) ? carrera : null;
    const config_certiAdulto = (certiAdulto) ? certiAdulto : null;
    const config_claveSol = (claveSol) ? claveSol : null;

    // Validaciones necesarias :
    if (!req.files.photo) errores.push('Es obligatorio el envío de la foto');
    if (!req.files.document) errores.push('Es obligatorio el envío del pdf del DNI');
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(nombres)) errores.push("Los nombres deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(apellidos)) errores.push("Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^\d{8}$/.test(dni)) errores.push("DNI debe tener exactamente 8 dígitos");
    if (!/^\d{11}$/.test(ruc) && (ruc && ruc !== 'NO TIENE RUC')) errores.push("RUC debe tener exactamente 11 dígitos");
    if (isNaN(hijos)) errores.push("El número de hijos debe ser un número entero mayor o igual a 0");
    if (isNaN(edad) || edad < 0 || edad > 120) errores.push("La edad debe ser un entero entre 0 y 120");
    if (!Date.parse(f_nacimiento)) errores.push("La fecha de nacimiento debe tener el formato YYYY-MM-DD");
    if (config_correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config_correo)) errores.push("El correo electrónico no es válido");
    if (config_domicilio && config_domicilio.length < 5) errores.push("El domicilio debe tener al menos 5 caracteres");
    if (config_celular && !/^\d{9}$/.test(config_celular)) errores.push("El número de celular debe tener entre 9 y 15 dígitos");
    if (config_f_inicio && !Date.parse(config_f_inicio)) errores.push("La fecha de inicio debe tener el formato YYYY-MM-DD");
    if (config_observaciones && config_observaciones.length > 200) errores.push("Las observaciones no pueden exceder 200 caracteres"); 
    if (!cci) errores.push('El CCI es un parámetro obligatorio');
    if (!/^\d{20}$/.test(cci)) errores.push('El CCI como mínimo debe tener 20 caracteres');
    if (!suspension) errores.push('El número de operación de la suspensión es un parámetro obligatorio');
    if (!id_cargo || isNaN(id_cargo)) errores.push('El ID de cargo es requerido y debe ser un entero');
    if (!id_turno || isNaN(id_turno)) errores.push('El ID de turno es requerido y debe ser un entero');
    if (!id_regimen_laboral || isNaN(id_regimen_laboral)) errores.push('El ID de régimen laboral es requerido y debe ser un entero');
    if (!id_sexo || isNaN(id_sexo)) errores.push('El ID de sexo es requerido y debe ser un entero');
    if (!id_jurisdiccion || isNaN(id_jurisdiccion)) errores.push('El ID de jurisdicción es requerido y debe ser un entero');
    if (!id_grado_estudios || isNaN(id_grado_estudios)) errores.push('El ID de grado de estudios es requerido y debe ser un entero');
    if (!id_subgerencia || isNaN(id_subgerencia)) errores.push('El ID de subgerencia es requerido y debe ser un entero');
    if (!id_funcion || isNaN(id_funcion)) errores.push('El ID de función es requerido y debe ser un entero');
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo)) errores.push('El ID de lugar de trabajo es requerido y debe ser un entero');
    if (!id_area || isNaN(id_area)) errores.push('El ID de área es requerido y debe ser un entero');

    if (errores.length > 0) {
        if (req.files.photo) await deletePhoto(req.files.photo[0].filename);
        if (req.files.document) await deletePdfDNI(req.files.document[0].filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
        // Validar si la personaa no pertenece a la Black List :
        const dark = await validateBlackList(nombres, apellidos, dni);
        if (dark) {
            await deletePhoto(req.files.photo[0].filename);
            await deletePdfDNI(req.files.document[0].filename);
            return res.status(400).json({
                message: 'La persona pertenece a la Black List, no puede laborar',
                data: []
            });
        }

        // Guardar en AXXON la imagen en base 64 :
        const savedPath = path.join('uploads', 'fotos', req.files.photo[0].filename).replace(/\\/g, '/');
        const fileBuffer = fs.readFileSync(req.files.photo[0].path);
        const fileBase64 = fileBuffer.toString('base64');
        const consulta = await createPerson(nombres, apellidos, dni, String(id_funcion), String(id_turno), fileBase64);
        if (!consulta) {
            await deletePhoto(req.files.photo[0].filename);
            await deletePdfDNI(req.files.document[0].filename);
            return res.status(400).json({
                message: 'La foto necesariamente debe mostrar el rostro de la persona nítidamente...',
                data: []
            });
        }

        const savedPdfDni = path.join('uploads', 'pdfdni', req.files.document[0].filename).replace(/\\/g, '/');
        const response = await createEmpleado(
            nombres, apellidos, dni, ruc, hijos, edad, f_nacimiento,
            config_correo, config_domicilio, config_celular, config_f_inicio, savedPath, config_observaciones, config_carrera,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area,
            savedPdfDni, cci, config_certiAdulto, config_claveSol, suspension
        );

        if (!response) {
            await deletePhoto(req.files.photo[0].filename);
            await deletePdfDNI(req.files.document[0].filename);
            return res.status(200).json({
                message: 'No se pudo crear al empleado',
                data: []
            });
        }

        // Registro en el historial :
        const historial = await createHistorial('create', 'Empleado', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del empleado con DNI ${dni} al historial`);

        // Creación exitosa del empleado :
        return res.status(200).json({
            message: 'Empleado creado exitosamente...',
            data: response
        });

    } catch (error) {
        if (req.files.photo) await deletePhoto(req.files.photo[0].filename);
        if (req.files.document) await deletePdfDNI(req.files.document[0].filename);
        res.status(500).json({
            message: 'Error interno al crear al empleado',
            error: error.message
        });
    }
};

const createEmpleadoOnlyInfoHandler = async (req, res) => {

    const {
        nombres, apellidos, dni, ruc, hijos, edad,
        f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, carrera,
        id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
        id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area
    } = req.body;

    const token = req.user;
    const errores = [];

    // Validaciones para aceptar campos nulos :
    const config_correo = (correo) ? correo : null;
    const config_domicilio = (domicilio) ? domicilio : null;
    const config_celular = (celular) ? celular : null;
    const config_f_inicio = (f_inicio) ? f_inicio : null;
    const config_observaciones = (observaciones) ? observaciones : null;
    const config_carrera = (carrera) ? carrera : null;

    // Validaciones necesarias :
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(nombres)) errores.push("Los nombres deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(apellidos)) errores.push("Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^\d{8}$/.test(dni)) errores.push("DNI debe tener exactamente 8 dígitos");
    if (!/^\d{11}$/.test(ruc) && (ruc && ruc !== 'NO TIENE RUC')) errores.push("RUC debe tener exactamente 11 dígitos");
    if (isNaN(hijos)) errores.push("El número de hijos debe ser un número entero mayor o igual a 0");
    if (isNaN(edad) || edad < 0 || edad > 120) errores.push("La edad debe ser un entero entre 0 y 120");
    if (!Date.parse(f_nacimiento)) errores.push("La fecha de nacimiento debe tener el formato YYYY-MM-DD");
    if (config_correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config_correo)) errores.push("El correo electrónico no es válido");
    if (config_domicilio && config_domicilio.length < 5) errores.push("El domicilio debe tener al menos 5 caracteres");
    if (config_celular && !/^\d{9}$/.test(config_celular)) errores.push("El número de celular debe tener entre 9 y 15 dígitos");
    if (config_f_inicio && !Date.parse(config_f_inicio)) errores.push("La fecha de inicio debe tener el formato YYYY-MM-DD");
    if (config_observaciones && config_observaciones.length > 200) errores.push("Las observaciones no pueden exceder 200 caracteres"); 
    if (!id_cargo || isNaN(id_cargo)) errores.push('El ID de cargo es requerido y debe ser un entero');
    if (!id_turno || isNaN(id_turno)) errores.push('El ID de turno es requerido y debe ser un entero');
    if (!id_regimen_laboral || isNaN(id_regimen_laboral)) errores.push('El ID de régimen laboral es requerido y debe ser un entero');
    if (!id_sexo || isNaN(id_sexo)) errores.push('El ID de sexo es requerido y debe ser un entero');
    if (!id_jurisdiccion || isNaN(id_jurisdiccion)) errores.push('El ID de jurisdicción es requerido y debe ser un entero');
    if (!id_grado_estudios || isNaN(id_grado_estudios)) errores.push('El ID de grado de estudios es requerido y debe ser un entero');
    if (!id_subgerencia || isNaN(id_subgerencia)) errores.push('El ID de subgerencia es requerido y debe ser un entero');
    if (!id_funcion || isNaN(id_funcion)) errores.push('El ID de función es requerido y debe ser un entero');
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo)) errores.push('El ID de lugar de trabajo es requerido y debe ser un entero');
    if (!id_area || isNaN(id_area)) errores.push('El ID de área es requerido y debe ser un entero');

    if (errores.length > 0) return res.status(200).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        // Validar si la personaa no pertenece a la Black List :
        const dark = await validateBlackList(nombres, apellidos, dni);
        if (dark) return res.status(200).json({
            message: 'La persona pertenece a la Black List, no puede laborar',
            data: []
        });

        const foto = 'Sin foto'
        const carasDni = 'Sin Pdf';
        const cci = 'No Definido';
        const certiAdulto = null;
        const claveSol = null;
        const suspension = 'No Definido';

        const response = await createEmpleado(
            nombres, apellidos, dni, ruc, hijos, edad, f_nacimiento,
            config_correo, config_domicilio, config_celular, config_f_inicio, foto, config_observaciones, config_carrera,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area,
            carasDni, cci, certiAdulto, claveSol, suspension
        );

        if (!response) return res.status(200).json({
            message: 'No se pudo crear al empleado',
            data: []
        });

        // Registro en el historial :
        const historial = await createHistorial('create', 'Empleado', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del empleado con DNI ${dni} al historial`);

        // Creación exitosa del empleado :
        return res.status(200).json({
            message: 'Empleado creado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear al empleado sin foto',
            error: error.message
        });
    }
};

// Handler para actualizar la información del empleados sin incluir datos privados (SECTOR TAREAJE) :
const updateEmpleadoHandler = async (req, res) => {

    const { id } = req.params;
    const {
        nombres, apellidos, dni, ruc, hijos, edad,
        f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, carrera, foto,
        id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
        id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area,
    } = req.body;
    const token = req.user;
    const errores = [];

    // Validaciones para aceptar campos nulos :
    const config_correo = (correo) ? correo : null;
    const config_domicilio = (domicilio) ? domicilio : null;
    const config_celular = (celular) ? celular : null;
    const config_f_inicio = (f_inicio) ? f_inicio : null;
    const config_observaciones = (observaciones) ? observaciones : null;
    const config_carrera = (carrera) ? carrera : null;

    if (!req.file && foto === 'Sin foto') return res.status(400).json({
        message: 'Es necesario subir la foto ya que no figura en el sistema',
        data: []
    });

    // Verificar si el empleado está registrado en Axxon :
    const dataAxxon = await readPerson();
    const match = dataAxxon.find(dato => dni === dato.dni);

    if (!req.file && !match) {
        return res.status(400).json({
            message: 'Es necesario subir nuevamente la foto para poder lograr el reconocimiento facial',
            data: []
        });
    }

    if (req.file && match) {
        await deletePhoto(req.file.filename);
        return res.status(400).json({
            message: 'La foto ya está registrada en el sistema, no se puede subir nuevamente',
            data: []
        });
    }

    // Validaciones necesarias :
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(nombres)) errores.push("Los nombres deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(apellidos)) errores.push("Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^\d{8}$/.test(dni)) errores.push("DNI debe tener exactamente 8 dígitos");
    if (!/^\d{11}$/.test(ruc) && (ruc && ruc !== 'NO TIENE RUC')) errores.push("RUC debe tener exactamente 11 dígitos");
    if (isNaN(hijos)) errores.push("El número de hijos debe ser un número entero mayor o igual a 0");
    if (isNaN(edad) || edad < 0 || edad > 120) errores.push("La edad debe ser un entero entre 0 y 120");
    if (!Date.parse(f_nacimiento)) errores.push("La fecha de nacimiento debe tener el formato YYYY-MM-DD");
    if (config_correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config_correo)) errores.push("El correo electrónico no es válido");
    if (config_domicilio && config_domicilio.length < 5) errores.push("El domicilio debe tener al menos 5 caracteres");
    if (config_celular && !/^\d{9}$/.test(config_celular)) errores.push("El número de celular debe tener entre 9 y 15 dígitos");
    if (config_f_inicio && !Date.parse(config_f_inicio)) errores.push("La fecha de inicio debe tener el formato YYYY-MM-DD");
    if (config_observaciones && config_observaciones.length > 200) errores.push("Las observaciones no pueden exceder 200 caracteres");
    if (!id_cargo || isNaN(id_cargo)) errores.push('El ID de cargo es requerido y debe ser un entero');
    if (!id_turno || isNaN(id_turno)) errores.push('El ID de turno es requerido y debe ser un entero');
    if (!id_regimen_laboral || isNaN(id_regimen_laboral)) errores.push('El ID de régimen laboral es requerido y debe ser un entero');
    if (!id_sexo || isNaN(id_sexo)) errores.push('El ID de sexo es requerido y debe ser un entero');
    if (!id_jurisdiccion || isNaN(id_jurisdiccion)) errores.push('El ID de jurisdicción es requerido y debe ser un entero');
    if (!id_grado_estudios || isNaN(id_grado_estudios)) errores.push('El ID de grado de estudios es requerido y debe ser un entero');
    if (!id_subgerencia || isNaN(id_subgerencia)) errores.push('El ID de subgerencia es requerido y debe ser un entero');
    if (!id_funcion || isNaN(id_funcion)) errores.push('El ID de función es requerido y debe ser un entero');
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo)) errores.push('El ID de lugar de trabajo es requerido y debe ser un entero');
    if (!id_area || isNaN(id_area)) errores.push('El ID de área es requerido y debe ser un entero');

    if (errores.length > 0) {
        if (req.file) await deletePhoto(req.file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
        // Instanciar la ruta de la foto en caso esté registrado o por registrar :
        let savedPath;

        // Guardar en AXXON si el empleado no ha sido registrado con anterioridad :
        if (req.file) {
            savedPath = path.join('uploads','fotos',req.file.filename).replace(/\\/g, '/');
            const fileBuffer = fs.readFileSync(req.file.path);
            const fileBase64 = fileBuffer.toString('base64');
            const consulta = await createPerson(nombres, apellidos, dni, String(id_funcion), String(id_turno), fileBase64);
            if (!consulta) {
                await deletePhoto(req.file.filename);
                return res.status(400).json({
                    message: 'La foto necesariamente debe mostrar el rostro de la persona nítidamente...',
                    data: []
                });
            }
        }
        else savedPath = foto;

        const previo = await getEmpleadoById(id);
        if (!previo) {
            if (req.file) await deletePhoto(req.file.filename);
            return res.status(200).json({
                message: 'Empleado no encontrado',
                data: []
            });
        }

        const response = await updateEmpleado(id,
            nombres, apellidos, dni, ruc, hijos, edad, f_nacimiento,
            config_correo, config_domicilio, config_celular, config_f_inicio, config_observaciones, config_carrera, savedPath,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area
        );

        if (!response) {
            if (req.file) await deletePhoto(req.file.filename);
            return res.status(400).json({
                message: 'No se pudo actualizar al empleado',
                data: []
            });
        }

        // Si la persona no está registrada, elimina la foto anterior de la DB de Tareaje :
        if (req.file && foto !== 'Sin foto') await deletePhoto(path.basename(foto));

        const historial = await createHistorial('update', 'Empleado', previo, response, token);
        if (!historial) console.warn(`No se agregó la creación del empleado con DNI ${dni} al historial`);
        
        // Actualización exitosa del empleado :
        return res.status(200).json({
            message: 'Empleado actualizado exitosamente...',
            data: response
        });

    } catch (error) {
        if (req.file) await deletePhoto(req.file.filename);
        res.status(500).json({
            message: 'Error interno al actualizar al empleado',
            error: error.message
        });
    }
};

// Handler para actualizar la información del empleados incluidos datos privados (SECTOR PAGOS) :
const updateEmpleadoPagoHandler = async (req, res) => {

    const { id } = req.params;
    const {
        nombres, apellidos, dni, ruc, hijos, edad,
        f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, carrera, foto,
        id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
        id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area,
        carasDni, cci, certiAdulto, claveSol, suspension
    } = req.body;
    const token = req.user;
    const errores = [];

    // Validaciones para aceptar campos nulos :
    const config_correo = (correo) ? correo : null;
    const config_domicilio = (domicilio) ? domicilio : null;
    const config_celular = (celular) ? celular : null;
    const config_f_inicio = (f_inicio) ? f_inicio : null;
    const config_observaciones = (observaciones) ? observaciones : null;
    const config_carrera = (carrera) ? carrera : null;
    const config_certiAdulto = (certiAdulto) ? certiAdulto : null;
    const config_claveSol = (claveSol) ? claveSol : null;

    if (!req.files.photo && foto === 'Sin foto') return res.status(400).json({
        message: 'Es necesario subir la foto ya que no figura en el sistema',
        data: []
    });

    if (!req.files.document && carasDni === 'Sin Pdf') return res.status(400).json({
        message: 'Es necesario subir el pdf del DNI ya que no figura en el sistema',
        data: []
    });

    // Verificar si el empleado está registrado en Axxon :
    const dataAxxon = await readPerson();
    const match = dataAxxon.find(dato => dni === dato.dni);

    if (!req.files.photo && !match) {
        return res.status(400).json({
            message: 'Es necesario subir nuevamente la foto para poder lograr el reconocimiento facial',
            data: []
        });
    }

    if (req.files.photo && match) {
        await deletePhoto(req.files.photo[0].filename);
        if (req.files.document) await deletePdfDNI(req.files.document[0].filename);
        return res.status(400).json({
            message: 'La foto ya está registrada en el sistema, no se puede subir nuevamente',
            data: []
        });
    }

    // Validaciones necesarias :
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(nombres)) errores.push("Los nombres deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(apellidos)) errores.push("Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^\d{8}$/.test(dni)) errores.push("DNI debe tener exactamente 8 dígitos");
    if (!/^\d{11}$/.test(ruc) && (ruc && ruc !== 'NO TIENE RUC')) errores.push("RUC debe tener exactamente 11 dígitos");
    if (isNaN(hijos)) errores.push("El número de hijos debe ser un número entero mayor o igual a 0");
    if (isNaN(edad) || edad < 0 || edad > 120) errores.push("La edad debe ser un entero entre 0 y 120");
    if (!Date.parse(f_nacimiento)) errores.push("La fecha de nacimiento debe tener el formato YYYY-MM-DD");
    if (config_correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config_correo)) errores.push("El correo electrónico no es válido");
    if (config_domicilio && config_domicilio.length < 5) errores.push("El domicilio debe tener al menos 5 caracteres");
    if (config_celular && !/^\d{9}$/.test(config_celular)) errores.push("El número de celular debe tener entre 9 y 15 dígitos");
    if (config_f_inicio && !Date.parse(config_f_inicio)) errores.push("La fecha de inicio debe tener el formato YYYY-MM-DD");
    if (config_observaciones && config_observaciones.length > 200) errores.push("Las observaciones no pueden exceder 200 caracteres");
    if (!cci) errores.push('El CCI es un parámetro obligatorio');
    if (!/^\d{20}$/.test(cci)) errores.push('El CCI como mínimo debe tener 20 caracteres');
    if (!suspension) errores.push('El número de operación de la suspensión es un parámetro obligatorio');
    if (!id_cargo || isNaN(id_cargo)) errores.push('El ID de cargo es requerido y debe ser un entero');
    if (!id_turno || isNaN(id_turno)) errores.push('El ID de turno es requerido y debe ser un entero');
    if (!id_regimen_laboral || isNaN(id_regimen_laboral)) errores.push('El ID de régimen laboral es requerido y debe ser un entero');
    if (!id_sexo || isNaN(id_sexo)) errores.push('El ID de sexo es requerido y debe ser un entero');
    if (!id_jurisdiccion || isNaN(id_jurisdiccion)) errores.push('El ID de jurisdicción es requerido y debe ser un entero');
    if (!id_grado_estudios || isNaN(id_grado_estudios)) errores.push('El ID de grado de estudios es requerido y debe ser un entero');
    if (!id_subgerencia || isNaN(id_subgerencia)) errores.push('El ID de subgerencia es requerido y debe ser un entero');
    if (!id_funcion || isNaN(id_funcion)) errores.push('El ID de función es requerido y debe ser un entero');
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo)) errores.push('El ID de lugar de trabajo es requerido y debe ser un entero');
    if (!id_area || isNaN(id_area)) errores.push('El ID de área es requerido y debe ser un entero');

    if (errores.length > 0) {
        if (req.files.photo) await deletePhoto(req.files.photo[0].filename);
        if (req.files.document) await deletePdfDNI(req.files.document[0].filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
        // Instanciar la ruta de la foto en caso esté registrado o por registrar :
        let savedPath;

        // Guardar en AXXON si el empleado no ha sido registrado con anterioridad :
        if (req.files.photo) {
            savedPath = path.join('uploads','fotos',req.files.photo[0].filename).replace(/\\/g, '/');
            const fileBuffer = fs.readFileSync(req.files.photo[0].path);
            const fileBase64 = fileBuffer.toString('base64');
            const consulta = await createPerson(nombres, apellidos, dni, String(id_funcion), String(id_turno), fileBase64);
            if (!consulta) {
                await deletePhoto(req.files.photo[0].filename);
                if (req.files.document) await deletePdfDNI(req.files.document[0].filename);
                return res.status(400).json({
                    message: 'La foto necesariamente debe mostrar el rostro de la persona nítidamente...',
                    data: []
                });
            }
        }
        else savedPath = foto;

        // Instanciar la ruta del pdf del DNI en caso se desee actualizar, crear o esté registrado :
        let savedPdfDni;
        if (req.files.document) savedPdfDni = path.join('uploads','pdfdni',req.files.document[0].filename).replace(/\\/g, '/');
        else savedPdfDni = carasDni;

        const previo = await getEmpleadoById(id);
        if (!previo) {
            if (req.file) await deletePhoto(req.file.filename);
            return res.status(200).json({
                message: 'Empleado no encontrado',
                data: []
            });
        }

        const response = await updateEmpleadoPago(id,
            nombres, apellidos, dni, ruc, hijos, edad, f_nacimiento,
            config_correo, config_domicilio, config_celular, config_f_inicio, config_observaciones, config_carrera, savedPath,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area,
            savedPdfDni, cci, config_certiAdulto, config_claveSol, suspension
        );

        if (!response) {
            if (req.files.photo) await deletePhoto(req.files.photo[0].filename);
            if (req.files.document) await deletePdfDNI(req.files.document[0].filename);
            return res.status(400).json({
                message: 'No se pudo actualizar al empleado',
                data: []
            });
        }

        // Si la persona no está registrada, elimina la foto anterior de la DB de Tareaje :
        if (req.files.photo && foto !== 'Sin foto') await deletePhoto(path.basename(foto));

        // Si se desea actualizar el pdf del DNI, se elimina el pdf anterior de la DB de Tareaje :
        if (req.files.document && carasDni !== 'Sin Pdf') await deletePdfDNI(path.basename(carasDni));

        // Agregar la actualización al historial :
        const historial = await createHistorial('update', 'Empleado', previo, response, token);
        if (!historial) console.warn(`No se agregó la creación del empleado con DNI ${dni} al historial`);
        
        // Actualización exitosa del empleado :
        return res.status(200).json({
            message: 'Empleado actualizado exitosamente...',
            data: response
        });

    } catch (error) {
        if (req.files.photo) await deletePhoto(req.files.photo[0].filename);
        if (req.files.document) await deletePdfDNI(req.files.document[0].filename);
        res.status(500).json({
            message: 'Error interno al actualizar al empleado para el sector de pagos',
            error: error.message
        });
    }
};

// Handler para cambiar el estado del empleado :
const deleteEmpleadoHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;
    
    if (!id || isNaN(id)) return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });

    try {
        const response = await deleteEmpleado(id);
        if (response === 1) return res.status(200).json({ message: 'Empleado no encontrado', data: {} });
        if (!response) return res.status(200).json({ message: 'No se pudo eliminar al empleado', data: {} });

        // Agregar el cambio de estado del empleado al historial :
        const historial = await createHistorial('delete', 'Empleado', response, null, token);
        if (!historial) console.warn(`No se agregó el cambio de estado del empleado con DNI ${response.dni} al historial`);

        return res.status(200).json({
            message: 'Empleado eliminado exitosamente...',
            data: response
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error interno al eliminar al empleado',
            error: error.message
        });
    }
};

// Handler para buscar el empleado mediante la función y el turno :
const findEmpleadoHandler = async (req, res) => {

    const { ids_subgerencia, id_turno, ids_area } = req.body;
    if (!ids_subgerencia) return res.status(400).json({ message: "La lista de subgerencias es obligatoria" });
    if (!id_turno) return res.status(400).json({ message: "El turno es obligatorio" });
    if (!ids_area) return res.status(400).json({ message: 'La lista de áreas es obligatoria'});

    try {
        const response = await findEmpleado(ids_subgerencia, id_turno, ids_area);
        if (!response || response.length === 0) {
            return res.status(400).json({
                message: "No hay nada",
                data: []
            });
        }
        return res.status(200).json({
            message: 'Mostrando empleados...',
            data: response
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error interno al obtener al empleado por funciones y turno',
            error: error.message
        });
    }
};

// PROVISIONAL :
const blackDeleteHandler = async (req, res) => {
    
    const { id } = req.params;
    
    try {
        const response = await deleteEmpleadoBlackList(id);
        if (!response) return res.status(400).json({
            message: "No se pudo black",
            data: []
        });
        
        return res.status(201).json({
            message: "Black exitoso",
            data: response
        });

    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor al crear la función.", error });
    }
};

const fechaEmpleadoHandler = async (req, res) => {
    
    const { id, fecha } = req.body;

    try {
        const response = await fechaEmpleado(id, fecha);
        if (!response) return res.status(400).json({
            message: "No se pudo nacimiento",
            data: []
        });
        
        return res.status(201).json({
            message: "Nacimiento completo exitoso",
            data: response
        });
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor al crear la función.", error });
    }
}

module.exports = {
    getAllUniverseEmpleadosHandlers,
    getAllEmpleadosHandlers,
    getAllEmpleadosPagosHandler,
    getEmpleadoHandler,
    getEmpleadoPagoHandler,
    getEmpleadoByDniHandler,
    createEmpleadoHandler,
    createEmpleadoPagoHandler,
    createEmpleadoOnlyInfoHandler,
    updateEmpleadoHandler,
    updateEmpleadoPagoHandler,
    deleteEmpleadoHandler,
    findEmpleadoHandler, 
    blackDeleteHandler,
    fechaEmpleadoHandler
};