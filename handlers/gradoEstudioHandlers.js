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
        console.error('Error al obtener todos los grados de estudio en el handler', error);
        return res.status(500).json({ message: "Error al obtener todos los grados de estudio en el handler" });
    }
};
// Handler para obtener una GradoEstudio por ID
const getGradoEstudioHandler = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un número válido' });
    }

    try {
        const response = await getGradoEstudio(id);

        if (!response) {
            return res.status(404).json({
                message: "Grado de Estudios no encontrada",
                data: []
            });
        }

        return res.status(200).json({
            message: "Grado de Estudios encontrada",
            data: response
        });
    } catch (error) {
        console.error('Error al buscar la Grado de Estudios:', error);
        return res.status(500).json({
            message: "Error al buscar la Grado de Estudios",
            error: error.message
        });
    }
};

// Handler para crear una nueva GradoEstudio
const createGradoEstudioHandler = async (req, res) => {

    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre debe contener solo letras y espacios');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const nuevaGradoEstudio = await createGradoEstudio({ nombre });
        if (!nuevaGradoEstudio) {
            return res.status(400).json({
                message: 'Grado de Estudio no creado',
                data: []
            });
        }

        const historial = await createHistorial(
            'create',
            'GradoEstudios',
            'nombre',
            null,
            nombre,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(201).json({
            message: 'Grado de Estudio creado exitosamente',
            data: nuevaGradoEstudio
        });
    } catch (error) {
        console.error('Error al crear el Grado de Estudio:', error);
        return res.status(500).json({ message: 'Error al crear el Grado de Estudio', error });
    }
};

const updateGradoEstudioHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!id) {
        errores.push('El campo ID es requerido');
    }
    if (isNaN(id)) {
        errores.push('El campo ID debe ser un número válido');
    }

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre debe contener solo letras y espacios');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const previo = await getGradoEstudio(id);
        const response = await updateGradoEstudio(id, { nombre });
        if (!response) {
            return res.status(404).json({
                message: "El Grado de Estudio no se encuentra",
                data: {}
            });
        }

        const historial = await createHistorial(
            'update',
            'GradoEstudios',
            'nombre',
            previo.nombre,
            nombre,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: "Registro modificado",
            data: response
        });
    } catch (error) {
        console.error('Error al modificar el Grado de Estudio:', error);
        return res.status(500).json({ message: "Error al modificar el Grado de Estudio", error });
    }
};


// Handler para eliminar una GradoEstudio (cambiar estado a inactivo)
const deleteGradoEstudioHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;

    try {
        const response = await deleteGradoEstudio(id);

        if (!response) {
            return res.status(404).json({
                message: `No se encontró el Grado de Estudio con ID:${id}`
            });
        }

        const historial = await createHistorial(
            'delete',
            'GradoEstudios',
            'nombre',
            response.nombre,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Grado de Estudio eliminada correctamente ',
            data:{}
        });
    } catch (error) {
        console.error('Error al eliminar la Grado de Estudio:', error);
        return res.status(500).json({ message: "Error al eliminar la Grado de Estudio" });
    }
};

module.exports = {
    getGradoEstudiosHandler,
    getGradoEstudioHandler,
    createGradoEstudioHandler,
    updateGradoEstudioHandler,
    deleteGradoEstudioHandler
};
