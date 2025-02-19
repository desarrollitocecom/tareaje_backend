const {
    getBlackListByID,
    getBlackListByDNI,
    getAllBlackList,
    createBlackListEmpleado,
} = require('../controllers/blackListController');

const { deleteEmpleadoBlackList } = require('../controllers/empleadoController');
const { createHistorial } = require('../controllers/historialController');

// Handler para obtener los datos de la Black List por ID :
const getBlackListByIDHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getBlackListByID(id);
        if (!response) return res.status(200).json({
            message: 'Persona no encontrada en la Black List',
            data: []
        });

        return res.status(200).json({
            message: 'Persona encontrada exitosamente en la Black List...',
            data: response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error interno al obtener los datos de la Black List por ID',
            error: error.message
        });
    }
};

// Handler para obtener los datos de la Black List por DNI :
const getBlackListByDNIHandler = async (req, res) => {

    const { dni } = req.params;
    const errores = [];

    if (!dni) errores.push('El parámetro DNI es obligatorio');
    if (!/^\d{8}$/.test(dni)) errores.push('El DNI debe tener 8 dígitos');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getBlackListByDNI(dni);
        if (!response) return res.status(200).json({
            message: 'Persona no encontrada en la Black List',
            data: []
        });

        return res.status(200).json({
            message: 'Persona encontrada exitosamente en la Black List...',
            data: response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error interno al obtener los datos de la Black List por DNI',
            error: error.message
        });
    }
};

// Handler para obtener todos los datos de todo el personal de la Black List :
const getAllBlackListHandler = async (req, res) => {

    const { page = 1, limit = 20, search, dni, periodo } = req.query;
    const filters = { search, dni, periodo };
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
        const response = await getAllBlackList(numPage, numLimit, filters);
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
            message: 'Personas obtenidas exitosamente en la Black List...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener todas las áreas',
            error: error.message
        });
    }
};

// Handler para ingresar una persona dentro de la Black List (SIN RETORNO) :
const createBlackListEmpleadoHandler = async (req, res) => {

    const { id, nombres, apellidos, dni, motivo, id_cargo, id_turno, id_regimen_laboral, id_sexo, 
        id_jurisdiccion, id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area, f_fin
    } = req.body;
    const token = req.user;
    const errores = [];

    const config_f_fin = (f_fin) ? f_fin : null;

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (!nombres) errores.push('Los nombres son un parámetro obligatorio');
    if (!apellidos) errores.push('Los apellidos son un parámetro obligatorio');
    if (!dni) errores.push('El parámetro DNI es obligatorio');
    if (!/^\d{8}$/.test(dni)) errores.push('El DNI debe tener 8 dígitos');
    if (!motivo) errores.push('El motivo es un parámetro obligatorio');
    if (config_f_fin && !Date.parse(config_f_fin)) errores.push("La fecha de inicio debe tener el formato YYYY-MM-DD");
    if (!id_cargo) errores.push('El ID de cargo es un parámetro obligatorio');
    if (!id_turno) errores.push('El ID de turno es un parámetro obligatorio');
    if (!id_regimen_laboral) errores.push('El ID de régimen laboral es un parámetro obligatorio');
    if (!id_sexo) errores.push('El ID de sexo es un parámetro obligatorio');
    if (!id_jurisdiccion) errores.push('El ID de jurisdicción es un parámetro obligatorio');
    if (!id_grado_estudios) errores.push('El ID de grado de estudios es un parámetro obligatorio');
    if (!id_subgerencia) errores.push('El ID de subgerencia es un parámetro obligatorio');
    if (!id_lugar_trabajo) errores.push('El ID de lugar de trabajo es un parámetro obligatorio');
    if (!id_area) errores.push('El ID de área es un parámetro obligatorio');
    if (!id_funcion) errores.push('El ID de función es un parámetro obligatorio');
    
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const ahora = new Date();
        const peruOffset = -5 * 60; // offset de Perú en minutos
        const localOffset = ahora.getTimezoneOffset(); 
        const dia = new Date(ahora.getTime() + (peruOffset - localOffset) * 60000);
        const fin = (config_f_fin) ? config_f_fin : dia.toISOString().split('T')[0];

        const empleado = await deleteEmpleadoBlackList(id, fin);
        if (!empleado) return res.status(404).json({
            message: 'Empleado no encontrado...',
            data: []
        });

        const response = await createBlackListEmpleado(
            nombres, apellidos, dni, motivo, fin, id_cargo, id_turno, id_regimen_laboral, id_sexo, 
            id_jurisdiccion, id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area
        );
        if (!response) return res.status(400).json({
            message: 'No se pudo agregar a la persona en la Black List...',
            data: []
        });

        const historial = await createHistorial('create', 'Blacklist', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del blaklist ${response.dni} al historial`);

        return res.status(200).json({
            message: 'Persona ingresada exitosamente en la Black List...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al ingresar una persona dentro de la Black List',
            error: error.message
        });
    }
};

module.exports = {
    getBlackListByIDHandler,
    getBlackListByDNIHandler,
    getAllBlackListHandler,
    createBlackListEmpleadoHandler
};