const {
    getCargoById,
    getAllCargos,
    createCargo,
    deleteCargo,
    updateCargo
} = require('../controllers/cargoController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener un cargo por ID :
const getCargoByIdHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getCargoById(id);
        if (!response) return res.status(200).json({
            message: 'Cargo no encontrado',
            data: []
        });

        return res.status(200).json({
            message: 'Cargo obtenido exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener el cargo por ID',
            error: error.message
        });
    }
};

// Handler para obtener todos los cargos con paginación y búsqueda :
const getAllCargosHandler = async (req, res) => {

    const { page = 1, limit = 20, search } = req.query;
    const filters = { search };
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
        const response = await getAllCargos(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if(numPage > totalPages){
            return res.status(200).json({
                message:'Página fuera de rango...',
                data:{
                    data:[],
                    currentPage: numPage,
                    pageCount: response.data.length,
                    totalCount: response.totalCount,
                    totalPages: totalPages,
                 }
                }
            );
        }
        
        return res.status(200).json({
            message: 'Cargos obtenidos exitosamente...',
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
            message: 'Error interno al obtener todos los cargos',
            error: error.message
        });
    }
};

// Handler para crear un cargo :
const createCargoHandler = async (req, res) => {

    const { nombre, sueldo, id_subgerencia } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombre) errores.push('El nombre es obligatorio');
    if (typeof nombre !== 'string') errores.push('El nombre debe ser una cadena de texto');

    if (!sueldo) errores.push('El sueldo es obligatorio');
    if (isNaN(sueldo)) errores.push('El sueldo debe ser un numero');
    else if (sueldo <= 0) errores.push('El sueldo no debe tener cantidades negativas');

    if (!id_subgerencia) errores.push('La subgerencia es obligatoria');
    if (isNaN(id_subgerencia)) errores.push('El id_subgerencia debe ser un numero');
    else if (id_subgerencia <= 0) errores.push('El id_subgerencia no debe tener cantidades negativas');

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const response = await createCargo(nombre, sueldo, id_subgerencia);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear el cargo',
            data: []
        });

        const historial = await createHistorial('create', 'Cargo', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del cargo ${nombre} al historial`);

        return res.status(201).json({
            message: 'Cargo creado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear el cargo',
            data: error.message
        });
    }
};

// Handler para actualizar un cargo :
const updateCargoHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre, sueldo, id_subgerencia } = req.body;
    const token = req.user;
    const errores = [];
 
    if (!nombre) errores.push('El nombre es obligatorio');
    if (typeof nombre !== 'string') errores.push('El nombre debe ser una cadena de texto');

    if (!sueldo) errores.push('El sueldo es obligatorio');
    if (isNaN(sueldo)) errores.push('El sueldo debe ser un numero');
    else if (sueldo <= 0) errores.push('El sueldo no debe tener cantidades negativas');

    if (!id_subgerencia) errores.push('La subgerencia es obligatoria');
    if (isNaN(id_subgerencia)) errores.push('El id_subgerencia debe ser un numero');
    else if (id_subgerencia <= 0) errores.push('El id_subgerencia no debe tener cantidades negativas');

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const previo = await getCargoById(id);
        if (!previo) return res.status(200).json({
            message: 'Cargo no encontrado',
            data: []
        });

        const response = await updateCargo(id, nombre, sueldo, id_subgerencia);
        if (!response) res.status(200).json({
            message: 'No se pudo actualizar el cargo',
            data: []
        });

        const historial = await createHistorial('update', 'Cargo', previo, response, token);
        if (!historial) console.warn(`No se agregó la actualización del cargo ${response.nombre} al historial`);

        return res.status(200).json({
            message: 'Cargo actualizado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar el cargo',
            error: error.message
        });
    }
};

// Handler para eliminar un cargo :
const deleteCargoHandler = async (req, res) => {

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
        const response = await deleteCargo(id);
        if (!response) return res.status(200).json({
            message: 'Cargo no encontrado',
            data: []
        });

        const historial = await createHistorial('delete', 'Cargo', response, null, token);
        if (!historial) console.warn(`No se agregó la eliminación del cargo ${response.nombre} al historial`);

        return res.status(200).json({
            message: 'Cargo elimminado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar el cargo',
            error: error.message
        });
    }
};

module.exports = {
    getCargoByIdHandler,
    getAllCargosHandler,
    createCargoHandler,
    updateCargoHandler,
    deleteCargoHandler
};