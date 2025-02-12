const {
    getPostulante,
    getPostulanteById,
    getAllPostulantes,
    getAllPostulantesBlackList,
    createPostulante,
    updatePostulante,
    deletePostulante
} = require('../controllers/postulanteController');

const { createHistorial } = require('../controllers/historialController');
const { deleteCv } = require('../utils/filesFunctions');
const { getAllDistritos, createDistrito } = require('../controllers/distritoController');
const { validateBlackList } = require('../controllers/blackListController');
const path = require('path');

// Handler para obtener la información del postulante :
const getPostulanteHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El campo ID es requerido');
    if (isNaN(id)) errores.push('El campo ID debe ser un número válido');
    if (errores.length > 0)  return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const response = await getPostulante(id);
        if (!response) return res.status(404).json({
            message: 'No se encuentra el postulante',
            data: []
        });

        return res.status(200).json({
            message: 'Postulante encontrado exitosamente...',
            data: response,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener el postulante por ID',
            error: error.message
        });
    }
};

// Handler para obtener todos los postulantes :
const getAllPostulantesHandler = async (req, res) => {

    const { page = 1, limit = 20, search, subgerencia, cargo, regimen, grado, sexo, convocatoria, dni, edadMin, edadMax, hijosMin, hijosMax } = req.query;
    const filters = { search, subgerencia, cargo, regimen, grado, sexo, convocatoria, dni, edadMin, edadMax, hijosMin, hijosMax };
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllPostulantes(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) return res.status(200).json({
            message: 'Página fuera de rango...',
            data:{
                data: [],
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

        return res.status(200).json({
            message: 'Postulantes obtenidos exitosamente...',
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
            message: 'Error interno al obtener todos los postulantes',
            error: error.message
        });
    }
};

// Handler para obtener todos los postulantes :
const getAllPostulantesBlackListHandler = async (req, res) => {

    const { page = 1, limit = 20, search, subgerencia, cargo, regimen, grado, sexo, convocatoria, dni, edadMin, edadMax, hijosMin, hijosMax } = req.query;
    const filters = { search, subgerencia, cargo, regimen, grado, sexo, convocatoria, dni, edadMin, edadMax, hijosMin, hijosMax };
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllPostulantesBlackList(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) return res.status(200).json({
            message: 'Página fuera de rango...',
            data:{
                data: [],
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

        return res.status(200).json({
            message: 'Postulantes de la Black List obtenidos exitosamente...',
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
            message: 'Error interno al obtener todos los postulantes de la Black List',
            error: error.message
        });
    }
};

// Handler para crear la información inicial de un postulante :
const createPostulanteHandler = async (req, res) => {

    const {
        nombres, apellidos, dni, ruc, f_nacimiento, talla, hijos, correo, domicilio, celular, carrera,
        observaciones, distrito,
        id_cargo, id_sexo, id_regimen_laboral, id_grado_estudios, id_subgerencia, id_convocatoria
    } = req.body;

    const token = req.user;
    const errores = [];

    // Validaciones para aceptar campos nulos :
    const config_ruc = (ruc) ? ruc : null;
    const config_f_nacimiento = (f_nacimiento) ? f_nacimiento : null;
    const config_talla = (talla) ? talla : null;
    const config_hijos = (hijos) ? hijos : null;
    const config_correo = (correo) ? correo : null;
    const config_domicilio = (domicilio) ? domicilio : null;
    const config_celular = (celular) ? celular : null;
    const config_carrera = (carrera) ? carrera : null;
    const config_observaciones = (observaciones) ? observaciones : null;

    // Validaciones necesarias :
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(nombres)) errores.push('Los nombres deben contener solo letras y tener entre 2 y 50 caracteres');
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(apellidos)) errores.push('Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres');
    if (!/^\d{8}$/.test(dni)) errores.push('El DNI debe tener exactamente 8 dígitos');
    if (config_ruc && !/^\d{11}$/.test(config_ruc) ) errores.push('El RUC debe tener exactamente 11 dígitos');
    if (config_talla && !parseFloat(config_talla)) errores.push('La talla debe ser un flotante');
    if (config_f_nacimiento && !Date.parse(config_f_nacimiento)) errores.push('La fecha de nacimiento debe tener el formato YYYY-MM-DD');
    if (config_hijos && isNaN(config_hijos)) errores.push('El número de hijos debe ser un entero');
    if (config_correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config_correo)) errores.push('El correo electrónico no es válido');
    if (config_domicilio && config_domicilio.length < 5) errores.push('El domicilio debe tener al menos 5 caracteres');
    if (config_celular && !/^\d{9}$/.test(config_celular)) errores.push('El número de celular debe tener entre 9 y 15 dígitos');
    if (config_carrera && typeof(config_carrera) !== 'string') errores.push('La carrera debe ser una cadena de texto');
    if (config_observaciones && config_observaciones.length > 200) errores.push('Las observaciones no pueden exceder 200 caracteres');
    if (!id_cargo || isNaN(id_cargo)) errores.push('El ID de cargo es requerido y debe ser un entero');
    if (!id_regimen_laboral || isNaN(id_regimen_laboral)) errores.push('El ID de régimen laboral es requerido y debe ser un entero');
    if (!id_sexo || isNaN(id_sexo)) errores.push('El ID de sexo es requerido y debe ser un entero');
    if (!id_grado_estudios || isNaN(id_grado_estudios)) errores.push('El ID de grado de estudios es requerido y debe ser un entero');
    if (!id_subgerencia || isNaN(id_subgerencia)) errores.push('El ID de subgerencia es requerido y debe ser un entero');
    if (!id_convocatoria || isNaN(id_convocatoria)) errores.push('El ID de convocatoria es requerido y debe ser un entero');

    if (errores.length > 0) {
        if (req.file) await deletePhoto(req.file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
        // Validar si la persona no pertenece a la Black List :
        const dark = await validateBlackList(nombres, apellidos, dni);
        const state_blacklist = (dark) ? true : false;

        // Crear la fecha de registro :
        const ahora = new Date();
        const peruOffset = -5 * 60; // offset de Perú en minutos
        const localOffset = ahora.getTimezoneOffset(); 
        const dia = new Date(ahora.getTime() + (peruOffset - localOffset) * 60000);
        const f_registro = dia.toISOString().split('T')[0];

        // En caso no exista un distrito, crearlo :
        let new_distrito = null;
        const distritos = await getAllDistritos(page = 0);
        const distritoName = distritos.data.find(d => d.nombre === distrito);
        if (!distritoName || distritoName.length === 0) new_distrito = await createDistrito(distrito);
        const id_distrito = (new_distrito) ? new_distrito.id : distritoName.id;

        // Instanciar la ruta del CV en caso se haya agregado :
        const cv = (req.file) ? path.join('uploads','cv',req.file.filename).replace(/\\/g, '/') : null;

        // Crear el postulante :
        const response = await createPostulante(
            nombres, apellidos, dni, config_ruc, config_f_nacimiento, config_talla, config_hijos, config_correo,
            config_domicilio, config_celular, f_registro, config_carrera, cv, observaciones, id_distrito,
            id_cargo, id_sexo, id_regimen_laboral, id_grado_estudios, id_subgerencia, id_convocatoria, state_blacklist
        );

        if (!response) {
            if (req.file) await deleteCv(req.file.filename);
            return res.status(400).json({
                message: 'No se pudo crear al postulante',
                data: []
            });
        }

        const historial = await createHistorial('create', 'Postulante', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del postulante con DNI ${dni} al historial`);

        return res.status(200).json({
            message: 'Postulante creado exitosamente...',
            data: response
        });

    } catch (error) {
        if (req.file) await deleteCv(req.file.filename);
        return res.status(500).json({
            message: 'Error interno al crear al postulante',
            error: error.message
        });
    }
};

// Actualizar la información inicial de una persona :
const updatePostulanteHandler = async (req, res) => {
    
    const { id } = req.params;
    const {
        nombres, apellidos, dni, ruc, f_nacimiento, talla, hijos, correo, domicilio, celular, carrera,
        observaciones, distrito, cv,
        id_cargo, id_sexo, id_regimen_laboral, id_grado_estudios, id_subgerencia, id_convocatoria
    } = req.body;

    const token = req.user;
    const errores = [];

    // Validaciones para aceptar campos nulos :
    const config_ruc = (ruc) ? ruc : null;
    const config_f_nacimiento = (f_nacimiento) ? f_nacimiento : null;
    const config_talla = (talla) ? talla : null;
    const config_hijos = (hijos) ? hijos : null;
    const config_correo = (correo) ? correo : null;
    const config_domicilio = (domicilio) ? domicilio : null;
    const config_celular = (celular) ? celular : null;
    const config_carrera = (carrera) ? carrera : null;
    const config_observaciones = (observaciones) ? observaciones : null;

    // Validaciones necesarias :
    if (!id) errores.push('El campo ID es requerido');
    if (isNaN(id)) errores.push('El campo ID debe ser un número válido');
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(nombres)) errores.push('Los nombres deben contener solo letras y tener entre 2 y 50 caracteres');
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]{2,30}$/.test(apellidos)) errores.push('Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres');
    if (!/^\d{8}$/.test(dni)) errores.push('El DNI debe tener exactamente 8 dígitos');
    if (config_ruc && !/^\d{11}$/.test(config_ruc) ) errores.push('El RUC debe tener exactamente 11 dígitos');
    if (config_talla && !parseFloat(config_talla)) errores.push('La talla debe ser un flotante');
    if (config_f_nacimiento && !Date.parse(config_f_nacimiento)) errores.push('La fecha de nacimiento debe tener el formato YYYY-MM-DD');
    if (config_hijos && isNaN(config_hijos)) errores.push('El número de hijos debe ser un entero');
    if (config_correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config_correo)) errores.push('El correo electrónico no es válido');
    if (config_domicilio && config_domicilio.length < 5) errores.push('El domicilio debe tener al menos 5 caracteres');
    if (config_celular && !/^\d{9}$/.test(config_celular)) errores.push('El número de celular debe tener entre 9 y 15 dígitos');
    if (config_carrera && typeof(config_carrera) !== 'string') errores.push('La carrera debe ser una cadena de texto');
    if (config_observaciones && config_observaciones.length > 200) errores.push('Las observaciones no pueden exceder 200 caracteres');
    if (!id_cargo || isNaN(id_cargo)) errores.push('El ID de cargo es requerido y debe ser un entero');
    if (!id_regimen_laboral || isNaN(id_regimen_laboral)) errores.push('El ID de régimen laboral es requerido y debe ser un entero');
    if (!id_sexo || isNaN(id_sexo)) errores.push('El ID de sexo es requerido y debe ser un entero');
    if (!id_grado_estudios || isNaN(id_grado_estudios)) errores.push('El ID de grado de estudios es requerido y debe ser un entero');
    if (!id_subgerencia || isNaN(id_subgerencia)) errores.push('El ID de subgerencia es requerido y debe ser un entero');
    if (!id_convocatoria || isNaN(id_convocatoria)) errores.push('El ID de convocatoria es requerido y debe ser un entero');

    if (errores.length > 0) {
        if (req.file) await deletePhoto(req.file.filename);
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores...',
            data: errores,
        });
    }

    try {
        const previo = await getPostulanteById(id);
        if (!previo) return res.status(404).json({
            message: 'Postulante no encontrado',
            data: []
        });

        // Validar si la persona no pertenece a la Black List :
        const dark = await validateBlackList(nombres, apellidos, dni);
        const state_blacklist = (dark) ? true : false;

        // En caso no exista un distrito, crearlo :
        let new_distrito = null;
        const distritos = await getAllDistritos(page = 0);
        const distritoName = distritos.data.find(d => d.nombre === distrito);
        if (!distritoName || distritoName.length === 0) new_distrito = await createDistrito(distrito);
        const id_distrito = (new_distrito) ? new_distrito.id : distritoName.id;

        // Instanciar la ruta del CV en caso se desee actualizar, crear o esté registrado :
        let saveCv;
        if (req.file) saveCv = path.join('uploads','cv',req.file.filename).replace(/\\/g, '/');
        else saveCv = cv;

        // Crear el postulante :
        const response = await updatePostulante(
            id, nombres, apellidos, dni, config_ruc, config_f_nacimiento, config_talla, config_hijos, config_correo,
            config_domicilio, config_celular, config_carrera, saveCv, observaciones, id_distrito,
            id_cargo, id_sexo, id_regimen_laboral, id_grado_estudios, id_subgerencia, id_convocatoria, state_blacklist
        );

        if (!response) {
            if (req.file) await deleteCv(req.file.filename);
            return res.status(400).json({
                message: 'No se pudo actualizar al postulante',
                data: []
            });
        }

        // Si se desea actualizar el CVI, se elimina el anterior de la DB de Tareaje :
        if (req.file && cv) await deleteCv(path.basename(cv));

        const historial = await createHistorial('update', 'Postulante', previo, response, token);
        if (!historial) console.warn(`No se agregó la actualización del postulante con DNI ${dni} al historial`);

        return res.status(200).json({
            message: 'Postulante actualizado exitosamente...',
            data: response
        });

    } catch (error) {
        if (req.file) await deleteCv(req.file.filename);
        return res.status(500).json({
            message: 'Error interno al crear al postulante',
            error: error.message
        });
    }
};

// Eliminar a un postulante :
const deletePostulanteHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await deletePostulante(id);
        if (!response) return res.status(200).json({
            message: 'Postulante no encontrado',
            data: []
        });

        const historial = await createHistorial('delete', 'Postulante', response, null, token);
        if (!historial) console.warn(`No se agregó la eliminación del postulante con DNI ${response.dni} al historial`);

        return res.status(200).json({
            message: 'Postulante elimminado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar al postulante',
            error: error.message
        });
    }
};

module.exports = {
    getPostulanteHandler,
    getAllPostulantesHandler,
    getAllPostulantesBlackListHandler,
    createPostulanteHandler,
    updatePostulanteHandler,
    deletePostulanteHandler
};