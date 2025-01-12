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

        if(numPage > totalPages) return res.status(200).json({
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

    const { nombres, apellidos, dni, motivo, id_cargo, id_turno, id_regimen_laboral, id_sexo, 
        id_jurisdiccion, id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area
    } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombres) errores.push('Los nombres son un parámetro obligatorio');
    if (!apellidos) errores.push('Los apellidos son un parámetro obligatorio');
    if (!dni) errores.push('El parámetro DNI es obligatorio');
    if (!/^\d{8}$/.test(dni)) errores.push('El DNI debe tener 8 dígitos');
    if (!motivo) errores.push('El motivo es un parámetro obligatorio');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const dia = new Date();
        const f_fin = dia.toISOString().split('T')[0];
        const empleado = await deleteEmpleadoBlackList(id, f_fin);
        if (!empleado) return res.status(200).json({
            message: 'Empleado no encontrado...',
            data: []
        });

        const response = await createBlackListEmpleado(
            nombres, apellidos, dni, motivo, f_fin, id_cargo, id_turno, id_regimen_laboral, id_sexo, 
            id_jurisdiccion, id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area
        );
        if (!response) return res.status(400).json({
            message: 'No se pudo agregar a la persona en la Black List...',
            data: []
        });

        const historial = await createHistorial(
            'create',
            'BlackList',
            'nombres, apellidos, dni, motivo, f_fin',
            null,
            `${nombres}, ${apellidos}, ${dni}, ${motivo}, ${f_fin}`,
            token
        );
        if (!historial) console.warn('No se agregó el create BlackList al historial...');

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