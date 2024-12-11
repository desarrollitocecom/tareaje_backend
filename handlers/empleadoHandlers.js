const { getAllUniverseEmpleados, getAllEmpleados, getEmpleado, createEmpleado,
    updateEmpleado, deleteEmpleado, findEmpleado } = require('../controllers/empleadoController');

const { createHistorial } = require('../controllers/historialController');
const { createPerson } = require('../controllers/axxonController');
const { deletePhoto } = require('../utils/filesFunctions');
const fs = require('fs');
const path = require('path');

const getAllUniverseEmpleadosHandlers = async (req, res) => {

    try {
        const response = await getAllUniverseEmpleados();
        if (!response) {
            return res.status(404).json({
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
    console.log("filtros: ",filters);
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page <= 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if (errores.length > 0) {
        return res.status(400).json({ message: "Se encontraron los siguentes errores:", data: errores });
    }
    try {
        const response = await getAllEmpleados(Number(page), Number(limit), filters); // Llamamos a la función getEmpleados
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

        const historial = await createHistorial(
            'read',
            'Empleado',
            `Read Empleado Id ${id}`,
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(201).json({
            message: 'Enpleado encontrado',
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el empleado." });
    }
};

const createEmpleadoHandler = async (req, res) => {

    const {
        nombres, apellidos, dni, ruc, hijos, edad,
        f_nacimiento, correo, domicilio, celular, f_inicio, observaciones,
        id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
        id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
    } = req.body;
    const token = req.user;
    const errores = [];

    // PROVISIONAL ------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------
    let correo_v = correo;
    let domicilio_v = domicilio;
    let celular_v = celular;
    let f_inicio_v = f_inicio;
    let observaciones_v = observaciones;
    if (correo === 'null') correo_v = null;
    if (domicilio === 'null') domicilio_v = null;
    if (celular === 'null') celular_v = null;
    if (f_inicio === 'null') f_inicio_v = null;
    if (observaciones === 'null') observaciones_v = null;
    // ------------------------------------------------------------------------------------------------------------

    // if (!req.file || req.file.length === 0) return res.status(400).json({ message: 'No se ha enviado foto' });
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(nombres))
        errores.push("Nombres deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(apellidos))
        errores.push("Apellidos deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^\d{8}$/.test(dni))
        errores.push("DNI debe tener exactamente 8 dígitos");
    if (!/^\d{11}$/.test(ruc) && (ruc && ruc !== 'NO TIENE RUC'))
        errores.push("RUC debe tener exactamente 11 dígitos");
    if (isNaN(hijos))
        errores.push("Número de hijos debe ser un número entero positivo");
    if (isNaN(edad) || edad < 0 || edad > 120)
        errores.push("Edad debe ser un número entre 0 y 120 años");
    if (!Date.parse(f_nacimiento))
        errores.push("Fecha de nacimiento debe tener el formato YYYY - MM - DD");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && (correo && correo !== 'null'))
        errores.push("Correo electrónico no válido");
    if (domicilio.length < 5 && (domicilio && domicilio !== 'null')) {
        errores.push("Domicilio debe tener al menos 5 caracteres");
    }
    // if (!/^\d{9}$/.test(celular) && (celular && celular !== 'null'))
    //    errores.push("Número de celular debe tener entre 9 y 15 dígitos");
    if (!Date.parse(f_inicio) && (f_inicio && f_inicio !== 'null'))
        errores.push("Fecha de inicio debe tener el formato YYYY-MM-DD");
    if (observaciones.length > 200 && (observaciones && observaciones !== 'null'))
        errores.push("Observaciones no pueden exceder 200 caracteres");
    if (!id_cargo || isNaN(id_cargo))
        errores.push('El id del cargo es requerido y debe ser un Numero')
    if (!id_turno || isNaN(id_turno))
        errores.push('El id del turno es requerido y debe ser un Numero')
    if (!id_regimen_laboral || isNaN(id_regimen_laboral))
        errores.push('El id del regimen laboral es requerido y debe ser un Numero')
    if (!id_sexo || isNaN(id_sexo))
        errores.push('El id sexo es requerido y debe ser un Numero')
    if (!id_jurisdiccion || isNaN(id_jurisdiccion))
        errores.push('El id jurisdiccion es requerido y debe ser un Numero')
    if (!id_grado_estudios || isNaN(id_grado_estudios))
        errores.push('El id grado estudios es requerido y debe ser un Numero')
    if (!id_subgerencia || isNaN(id_subgerencia))
        errores.push('El id de la sungerencia es requerido y debe ser un Numero')
    if (!id_funcion || isNaN(id_funcion))
        errores.push('El id de la funcion es requerido y debe ser un Numero')
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo))
        errores.push('El id del lugar trabajo es requerido y debe ser un Numero')

    if (errores.length > 0) {
        if (req.file) await deletePhoto(req.file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }
    try {
        // Guardar en AXXON la imagen en base 64 :
        // const fileBuffer = fs.readFileSync(req.file.path);
        // const fileBase64 = fileBuffer.toString('base64');
        // const consulta = await createPerson(nombres, apellidos, dni, String(id_funcion), String(id_turno), fileBase64);
        // if (!consulta) console.warn(`No se pudo crear al empleado ${apellidos} ${nombres} con ${dni} en Axxon...`);

        // Guardar la ruta relativa de la imagen :
        // const savedPath = path.join('uploads', 'fotos', req.file.filename).replace(/\\/g, '/');

        // PROVISIONAL ------------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------------------------------
        let savedPath;
        if (req.file) {
            savedPath = path.join('uploads', 'fotos', req.file.filename).replace(/\\/g, '/');
            const fileBuffer = fs.readFileSync(req.file.path);
            const fileBase64 = fileBuffer.toString('base64');
            const consulta = await createPerson(nombres, apellidos, dni, String(id_funcion), String(id_turno), fileBase64);
            if (!consulta) console.warn(`No se pudo crear al empleado ${apellidos} ${nombres} con ${dni} en Axxon...`);
        }
        else savedPath = 'Sin foto';
        // ------------------------------------------------------------------------------------------------------------

        const newEmpleado = await createEmpleado(
            nombres, apellidos, dni, ruc, hijos, edad,
            f_nacimiento, correo_v, domicilio_v, celular_v, f_inicio_v, savedPath, observaciones_v,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
        );

        if (!newEmpleado) {
            await deletePhoto(req.file.filename);
            return res.status(200).json({ message: 'No se encuentra empleado', data: [] });
        }
        /*         const historial = await createHistorial(
                    'create',
                    'Empleado',
                    'nombres, apellidos, dni, id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion, id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo',
                    null,
                    `${nombres}, ${apellidos}, ${id_cargo}, ${id_turno}, ${id_regimen_laboral}, ${id_sexo}, ${id_jurisdiccion}, ${id_grado_estudios}, ${id_subgerencia}, ${id_funcion}, ${id_lugar_trabajo}`,
                    token
                );
                if (!historial) console.warn('No se agregó al historial...'); */

        return res.status(200).json({ message: 'Nuevo Empleado Creado', data: newEmpleado })
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al Crear el empleado." });
    }
};

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

    const file = req.file
    const photo = foto !== 'Sin foto'

    if (file && photo) errores.push('Solo se puede subir la foto una vez');
    if (!file && !photo) errores.push('Es necesario subir la foto');
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,30}$/.test(nombres))
        errores.push("Nombres deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,30}$/.test(apellidos))
        errores.push("Apellidos deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^\d{8}$/.test(dni))
        errores.push("DNI debe tener exactamente 8 dígitos");
    if (!/^\d{11}$/.test(ruc))
        errores.push("RUC debe tener exactamente 11 dígitos");
    if (isNaN(hijos))
        errores.push("Número de hijos debe ser un número entero positivo");
    if (isNaN(edad) || edad < 0 || edad > 120)
        errores.push("Edad debe ser un número entre 0 y 120 años");
    if (!Date.parse(f_nacimiento))
        errores.push("Fecha de nacimiento debe tener el formato YYYY - MM - DD");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
        errores.push("Correo electrónico no válido");
    if (!domicilio || domicilio.length < 5) {
        errores.push("Domicilio debe tener al menos 5 caracteres");
    }
    if (!/^\d{9}$/.test(celular) || !celular)
        errores.push("Número de celular debe tener entre 9 y 15 dígitos");
    if (!Date.parse(f_inicio) || !f_inicio)
        errores.push("Fecha de inicio debe tener el formato YYYY-MM-DD");
    if ((observaciones && observaciones.length > 200) || !observaciones)
        errores.push("Observaciones no pueden exceder 200 caracteres");
    if (!id_cargo || isNaN(id_cargo))
        errores.push('El id del cargo es requerido y debe ser un Numero')
    if (!id_turno || isNaN(id_turno))
        errores.push('El id del turno es requerido y debe ser un Numero')
    if (!id_regimen_laboral || isNaN(id_regimen_laboral))
        errores.push('El id del regimen laboral es requerido y debe ser un Numero')
    if (!id_sexo || isNaN(id_sexo))
        errores.push('El id sexo es requerido y debe ser un Numero')
    if (!id_jurisdiccion || isNaN(id_jurisdiccion))
        errores.push('El id jurisdiccion es requerido y debe ser un Numero')
    if (!id_grado_estudios || isNaN(id_grado_estudios))
        errores.push('El id grado estudios es requerido y debe ser un Numero')
    if (!id_subgerencia || isNaN(id_subgerencia))
        errores.push('El id de la sungerencia es requerido y debe ser un Numero')
    if (!id_funcion || isNaN(id_funcion))
        errores.push('El id de la funcion es requerido y debe ser un Numero')
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo))
        errores.push('El id del lugar trabajo es requerido y debe ser un Numero')

    if (errores.length > 0) {
        if (req.file) await deletePhoto(req.file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
        let savedPath;
        if (req.file) {
            savedPath = path.join('uploads', 'fotos', req.file.filename).replace(/\\/g, '/');
            const fileBuffer = fs.readFileSync(req.file.path);
            const fileBase64 = fileBuffer.toString('base64');
            const consulta = await createPerson(nombres, apellidos, dni, String(id_funcion), String(id_turno), fileBase64);
            if (!consulta) console.warn(`No se pudo crear al empleado ${apellidos} ${nombres} con ${dni} en Axxon...`);
        }
        else savedPath = foto;

        const response = await updateEmpleado(id,
            nombres, apellidos, dni, ruc, hijos, edad,
            f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, savedPath,
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
        
        return res.status(200).json({ message: 'Empleado Modificado', data: response });

    } catch (error) {
        console.error("Error al actualizar el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al Actualizar el empleado." });
    }
};

const deleteEmpleadoHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;
    
    if (!id || isNaN(id)) return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });

    try {
        const response = await deleteEmpleado(id);
        if (response === 1) return res.status(404).json({ message: 'Empleado no encontrado', data: {} });
        if (!response) return res.status(400).json({ message: 'No se pudo eliminar al empleado', data: {} });

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
}

module.exports = {
    getAllUniverseEmpleadosHandlers,
    getAllEmpleadosHandlers,
    getEmpleadoHandler,
    createEmpleadoHandler,
    updateEmpleadoHandler,
    deleteEmpleadoHandler,
    findEmpleadoHandler
};