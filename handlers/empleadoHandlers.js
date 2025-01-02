const {
    getAllUniverseEmpleados,
    getAllEmpleados,
    getEmpleado,
    getEmpleadoByDni,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    findEmpleado } = require('../controllers/empleadoController');

const { createHistorial } = require('../controllers/historialController');
const { createPerson } = require('../controllers/axxonController');
const { deletePhoto } = require('../utils/filesFunctions');
const { readPerson } = require('../controllers/axxonController');
const fs = require('fs');
const path = require('path');
const e = require('express');

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
        console.error("Error al obtener empleados:", error); // Log para debugging
        res.status(500).json({ error: "Error interno del servidor al obtener los empleados." });
    }
};

const getAllEmpleadosHandlers = async (req, res) => {

    const { page = 1, limit = 20, search, subgerencia, turno, cargo, regimen, jurisdiccion, sexo, dni, state, edadMin, edadMax, hijosMin, hijosMax } = req.query;
    const filters = { search, subgerencia, turno, cargo, regimen, jurisdiccion, sexo, dni, state,edadMin, edadMax, hijosMin, hijosMax };
    //console.log("filtros: ",filters);
    const errores = [];
    // console.log("page: ", page);

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if (errores.length > 0) {
        return res.status(400).json({ message: "Se encontraron los siguentes errores:", data: errores });
    }
    try {
        const response = await getAllEmpleados(Number(page), Number(limit), filters); // Llamamos a la función getEmpleados
        // console.log("response: ", response);
        
        if (response.data.length === 0) {
            return res.status(200).json(
                {
                    message: 'Ya no hay mas Empleados',
                    data: {
                        data: [],
                        totalPage: response.currentPage,
                        totalCount: response.totalCount
                    }
                }
            );
        }

        return res.status(200).json({
            message: "Empleados obtenidos correctamente",
            data: response,
        })
    } catch (error) {
        console.error("Error al obtener empleados:", error); // Log para debugging
        res.status(500).json({ error: "Error interno del servidor al obtener los empleados." });
    }
};

const getEmpleadoHandler = async (req, res) => {

    const { id } = req.params
    const token = req.user;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await getEmpleado(id);
        if (!response) {
            return res.status(200).json({
                message: 'No se encuentra el empleado',
                data: {}
            })
        };

        return res.status(201).json({
            message: 'Enpleado encontrado',
            data: response,
        });

    } catch (error) {
        console.error("Error al obtener el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el empleado." });
    }
};

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
        console.error("Error al obtener el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el empleado." });
    }
}

// Handler para crear al empleado :
const createEmpleadoHandler = async (req, res) => {

    const {
        nombres, apellidos, dni, ruc, hijos, edad,
        f_nacimiento, correo, domicilio, celular, f_inicio, observaciones,
        id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
        id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
    } = req.body;
    const token = req.user;
    const errores = [];

    // Validaciones para aceptar campos nulos :
    const config_correo = (correo) ? correo : null;
    const config_domicilio = (domicilio) ? domicilio : null;
    const config_celular = (celular) ? celular : null;
    const config_f_inicio = (f_inicio) ? f_inicio : null;
    const config_observaciones = (observaciones) ? observaciones : null;

    // Validaciones necesarias :
    if (!req.file || req.file.length === 0) errores.push('Es obligatorio el envío de la foto');
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
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo)) errores.push('El id del lugar trabajo es requerido y debe ser un entero');

    if (errores.length > 0) {
        if (req.file) await deletePhoto(req.file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
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

        const newEmpleado = await createEmpleado(
            nombres, apellidos, dni, ruc, hijos, edad, f_nacimiento,
            config_correo, config_domicilio, config_celular, config_f_inicio, savedPath, config_observaciones,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
        );

        if (!newEmpleado) {
            await deletePhoto(req.file.filename);
            return res.status(200).json({
                message: 'No se encuentra empleado',
                data: []
            });
        }

        // Registro en el historial :
        const historial = await createHistorial(
            'create',
            'Empleado',
            'nombres, apellidos, dni, id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion, id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo',
            null,
            `${nombres}, ${apellidos}, ${id_cargo}, ${id_turno}, ${id_regimen_laboral}, ${id_sexo}, ${id_jurisdiccion}, ${id_grado_estudios}, ${id_subgerencia}, ${id_funcion}, ${id_lugar_trabajo}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        // Creación exitosa del empleado :
        return res.status(200).json({ message: 'Nuevo Empleado Creado', data: newEmpleado })

    } catch (error) {
        if (req.file) await deletePhoto(req.file.filename);
        console.error("Error al crear el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al Crear el empleado." });
    }
};

// Handler para actualizar al empleado :
const updateEmpleadoHandler = async (req, res) => {

    const { id } = req.params;
    const {
        nombres, apellidos, dni, ruc, hijos, edad,
        f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, foto,
        id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
        id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
    } = req.body;
    const token = req.user;
    const errores = [];

    // Validaciones para aceptar campos nulos :
    const config_correo = (correo) ? correo : null;
    const config_domicilio = (domicilio) ? domicilio : null;
    const config_celular = (celular) ? celular : null;
    const config_f_inicio = (f_inicio) ? f_inicio : null;
    const config_observaciones = (observaciones) ? observaciones : null;

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
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo)) errores.push('El id del lugar trabajo es requerido y debe ser un entero');

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

        const response = await updateEmpleado(id,
            nombres, apellidos, dni, ruc, hijos, edad, f_nacimiento,
            config_correo, config_domicilio, config_celular, config_f_inicio, config_observaciones, savedPath,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
        );

        if (response === 1) {
            if (req.file) await deletePhoto(req.file.filename);
            return res.status(200).json({ message: 'Empleado no encontrado', data: {} });
        }

        if (!response) {
            if (req.file) await deletePhoto(req.file.filename);
            return res.status(200).json({ message: 'No se pudo actualizar al empleado', data: {} });
        }

        // Si la persona no está registrada, elimina la foto anterior de la DB de Tareaje :
        if (req.file && foto !== 'Sin foto') await deletePhoto(path.basename(foto));

        // Agregar la actualización al historial :
        const historial = await createHistorial(
            'update',
            'Empleado',
            'nombres, apellidos, dni',
            `${nombres}, ${apellidos}, ${dni}`,
            `${nombres}, ${apellidos}, ${dni}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');
        
        // Actualización exitosa del empleado :
        return res.status(200).json({ message: 'Empleado Modificado', data: response });

    } catch (error) {
        if (req.file) await deletePhoto(req.file.filename);
        console.error("Error al actualizar el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el empleado." });
    }
};

const deleteEmpleadoHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;
    
    if (!id || isNaN(id)) return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });

    try {
        const response = await deleteEmpleado(id);
        if (response === 1) return res.status(200).json({ message: 'Empleado no encontrado', data: {} });
        if (!response) return res.status(200).json({ message: 'No se pudo eliminar al empleado', data: {} });

        const historial = await createHistorial(
            'create',
            'Empleado',
            'nombres, apellidos, dni, id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion, id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo',
            `${response.nombres}, ${response.apellidos}, ${response.id_cargo}, ${response.id_turno}, ${response.id_regimen_laboral}, ${response.id_sexo}, ${response.id_jurisdiccion}, ${response.id_grado_estudios}, ${response.id_subgerencia}, ${response.id_funcion}, ${response.id_lugar_trabajo}`,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Empleado eliminado correctamente',
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el empleado." });

    }
};

const findEmpleadoHandler = async (req, res) => {

    const { ids_funcion, id_turno } = req.body;
    if (!ids_funcion) return res.status(400).json({ message: "El cargo es obligatorio" });
    if (!id_turno) return res.status(400).json({ message: "El turno es obligatorio" });

    try {
        const response = await findEmpleado(ids_funcion, id_turno);
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
        return res.status(500).json({
            message: "Error al obtener todas las asistencias por día en el handler",
            error: error.message
        });
    }
};

module.exports = {
    getAllUniverseEmpleadosHandlers,
    getAllEmpleadosHandlers,
    getEmpleadoHandler,
    getEmpleadoByDniHandler,
    createEmpleadoHandler,
    updateEmpleadoHandler,
    deleteEmpleadoHandler,
    findEmpleadoHandler
};