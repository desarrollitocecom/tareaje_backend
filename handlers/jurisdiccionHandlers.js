const { getJurisdicciones,
    createJurisdiccion,
    getJurisdiccion,
    updateJurisdiccion,
    deleteJurisdiccion
} = require('../controllers/jurisdiccionController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener todos los jurisdicciones con paginación y búsqueda :
const getJurisdiccionesHandler = async (req, res) => {

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
        const response = await getJurisdicciones(numPage, numLimit, filters);
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
            message: 'Jurisdicciones obtenidas exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });
        
    } catch (error) {
        console.error('Error al obtener todas las jurisdicciones en el handler', error);
        return res.status(500).json({ message: "Error al obtener todas las jurisdicciones en el handler" });
    }
}

//Handlers para obtener una Jurisdiccion 
const getJurisdiccionHandler = async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await getJurisdiccion(id);

        if (!response || response.length === 0) {
            return res.status(404).json({
                message: "Función no encontrada",
                data: []
            });
        }
  
        return res.status(200).json({
            message: "Función encontrada",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al buscar la función",
            error: error.message
        });
    }
};

//handlers para crear una nueva Jurisdiccion
const createJurisdiccionHandler = async (req, res) => {

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
        const nuevaJurisdiccion = await createJurisdiccion({ nombre });
        if (!nuevaJurisdiccion) {
            return res.status(400).json({
                message: 'Jurisdicción no creada',
                data: []
            });
        }

        const historial = await createHistorial(
            'create',
            'Jurisdiccion',
            'nombre',
            null,
            nombre,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(201).json({
            message: 'Jurisdicción creada exitosamente',
            data: nuevaJurisdiccion
        });
    } catch (error) {
        console.error('Error al crear la jurisdicción:', error);
        return res.status(500).json({ message: 'Error al crear la jurisdicción', error });
    }
};

// Handler para modificar una Jurisdicción
const updateJurisdiccionHandler = async (req, res) => {

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
        const previo = await getJurisdiccion(id);
        const response = await updateJurisdiccion(id, { nombre });
        if (!response) {
            return res.status(404).json({
                message: "La Jurisdicción no se encuentra",
                data: {}
            });
        }

        const historial = await createHistorial(
            'update',
            'Jurisdiccion',
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
        console.error('Error al modificar la jurisdicción:', error);
        return res.status(500).json({ message: "Error al modificar la jurisdicción", error });
    }
};

const deleteJurisdiccionHandler = async (req, res) => {

    const id = req.params.id;
    const token = req.user;

    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la función para eliminar (estado a inactivo)
        const response = await deleteJurisdiccion(id);

        if (!response) {
            return res.status(200).json({
                message: `No se encontró la Jurisdiccion con ID :${id}`,
                data:{}
            })
        }

        const historial = await createHistorial(
            'delete',
            'Jurisdiccion',
            'nombre',
            response.nombre,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Función eliminada correctamente '
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getJurisdiccionesHandler,
    getJurisdiccionHandler,
    createJurisdiccionHandler,
    updateJurisdiccionHandler,
    deleteJurisdiccionHandler
}
