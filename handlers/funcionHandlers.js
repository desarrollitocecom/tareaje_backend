const { getFunciones,
    createFuncion,
    getFuncion,
    updateFuncion,
    deleteFuncion
} = require('../controllers/funcionController');

const { createHistorial } = require('../controllers/historialController');
const { updateFuncionRangoHorario } = require('../controllers/rangohorarioController')

// Handler para obtener todos las funciones con paginación y búsqueda :
const getFuncionesHandler = async (req, res) => {

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
        const response = await getFunciones(numPage, numLimit, filters);
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
            message: 'Funciones obtenidas exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });
        
    } catch (error) {
        console.error('Error al obtener todas las funciones en el handler', error);
        return res.status(500).json({ message: "Error al obtener todas las funciones en el handler" });
    }
}

const getFuncionHandler = async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await getFuncion(id);

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


const createFuncionHandler = async (req, res) => {

    const { nombre, tipo } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombre) errores.push('El campo nombre es requerido');
    if (typeof nombre !== 'string') errores.push('El campo nombre debe ser una cadena de texto');
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) errores.push('El campo nombre contiene caracteres inválidos');
    if (!tipo) errores.push('El campo tipo es obligatorio');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await createFuncion(nombre, tipo);
        if (!response) return res.status(400).json({ message: "No se pudo crear la función", data: [] });

        const historial = await createHistorial(
            'create',
            'Funcion',
            'nombre',
            null,
            nombre,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        await updateFuncionRangoHorario(tipo, response.id)
        return res.status(201).json({
            message: "Función creada exitosamente",
            data: response
        });

    } catch (error) {
        console.error("Error al crear función:", error);
        return res.status(500).json({ message: "Error interno del servidor al crear la función.", error });
    }
};

const updateFuncionHandler = async (req, res) => {

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
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const previo = await getFuncion(id);
        const response = await updateFuncion(id, { nombre });
        if (!response) {
            return res.status(404).json({
                message: "La función no se encuentra",
                data: {}
            });
        }

        const historial = await createHistorial(
            'update',
            'Funcion',
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
        res.status(500).json({ message: "Error al actualizar la función", error });
    }
};

const deleteFuncionHandler = async (req, res) => {

    const id = req.params.id;
    const token = req.user;

    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la función para eliminar (estado a inactivo)
        const response = await deleteFuncion(id);

        if (!response) {
            return res.status(204).json({
                message: `No se encontró la funcion con ID${id}`
            })
        }

        const historial = await createHistorial(
            'delete',
            'Funcion',
            'nombre',
            response.nombre,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Función eliminada correctamente (estado cambiado a inactivo)'
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getFuncionesHandler,
    getFuncionHandler,
    createFuncionHandler,
    updateFuncionHandler,
    deleteFuncionHandler
}

