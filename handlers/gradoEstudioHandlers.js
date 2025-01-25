const {
    getGradoEstudios,
    createGradoEstudio,
    getGradoEstudio,
    updateGradoEstudio,
    deleteGradoEstudio
} = require('../controllers/gradoestudioController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos los grados de estudio con paginación y búsqueda :
const getGradoEstudiosHandler = async (req, res) => {

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
        const response = await getGradoEstudios(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) return res.status(200).json({
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
        
        return res.status(200).json({
            message: 'Grados de estudio obtenidos exitosamente...',
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
            message: 'Error interno al obtener todos los grados de estudio',
            error: error.message
        });
    }
};

// Handler para obtener un grado de estudio por ID
const getGradoEstudioHandler = async (req, res) => {

    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getGradoEstudio(id);
        if (!response) return res.status(200).json({
            message: 'Grado de estudio no encontrado...',
            data: []
        });

        return res.status(200).json({
            message: 'Grado de estudio encontrado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener el grado de estudio por ID',
            error: error.message
        });
    }
};

// Handler para crear un nuevo grado de estudio :
const createGradoEstudioHandler = async (req, res) => {

    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombre) errores.push('El campo nombre es requerido');
    if (typeof nombre !== 'string') errores.push('El campo nombre debe ser una cadena de texto');

    if (errores.length > 0)  return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const response = await createGradoEstudio(nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear el grado de estudio...',
            data: []
        });

        const historial = await createHistorial('create', 'GradoEstudios', null, response, token);
        if (!historial) console.warn(`No se agregó la creación del grado de estudio ${nombre} al historial`);

        return res.status(200).json({
            message: 'Grado de estudio creado exitosamente...',
            data: response
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear el grado de estudio',
            error: error.message
        });
    }
};

// Handler para actualizar un grado de estudio :
const updateGradoEstudioHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!id) errores.push('El campo ID es requerido');
    if (isNaN(id)) errores.push('El campo ID debe ser un número válido');
    if (!nombre) errores.push('El campo nombre es requerido');
    if (typeof nombre !== 'string') errores.push('El campo nombre debe ser una cadena de texto');

    if (errores.length > 0)  return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores
    });

    try {
        const previo = await getGradoEstudio(id);
        if (!previo) return res.status(200).json({
            message: 'Grado de estudio no encontrado',
            data: []
        });

        const response = await updateGradoEstudio(id, nombre);
        if (!response) return res.status(200).json({
            message: 'No se pudo actualizar el grado de estudio...',
            data: []
        });

        const historial = await createHistorial('update', 'GradoEstudios', previo, response, token);
        if (!historial) console.warn(`No se agregó la actualización del grado de estudio ${previo.nombre} al historial`);

        return res.status(200).json({
            message: "Grado de estudio actualizado exitosamente...",
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al actualizar el grado de estudio',
            error: error.message
        });
    }
};


// Handler para eliminar un grado de estudio :
const deleteGradoEstudioHandler = async (req, res) => {

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
        const response = await deleteGradoEstudio(id);
        if (!response) return res.status(200).json({
            message: 'Grado de estudio no encontrado',
            data: []
        });

        const historial = await createHistorial('delete', 'GradoEstudios', response, null, token);
        if (!historial) console.warn(`No se agregó la eliminación del grado de estudio ${response.nombre} al historial`);

        return res.status(200).json({
            message: 'Grado de estudio eliminado exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al eliminar el grado de estudio',
            error: error.message
        });
    }
};

module.exports = {
    getGradoEstudiosHandler,
    getGradoEstudioHandler,
    createGradoEstudioHandler,
    updateGradoEstudioHandler,
    deleteGradoEstudioHandler
};
