const { getSexos,
    createSexo,
    getSexo,
    updateSexo,
    deleteSexo
} = require('../controllers/sexoController');

const { createHistorial } = require('../controllers/historialController');

// Handler para obtener los sexos con paginación y búsqueda :
const getSexosHandler = async (req, res) => {
   
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
        const response = await getSexos(numPage, numLimit, filters);
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
            message: 'Sexos obtenidos exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });
        
    } catch (error) {
        console.error('Error al obtener todos los sexos en el handler', error);
        return res.status(500).json({ message: "Error al obtener todos los sexos en el handler" });
    }
};

//Handlers para obtener una Sexo 
const getSexoHandler = async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await getSexo(id);

        if (!response || response.length === 0) {
            return res.status(404).json({
                message: "Sexo no encontrado",
                data: []
            });
        }

        return res.status(200).json({
            message: "Sexo encontrado",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al buscar el Sexo",
            error: error.message
        });
    }
};
//handlers para crear una nueva Sexo

const createSexoHandler = async (req, res) => {

    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombre ) {
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
        const nuevaSexo = await createSexo({ nombre });
        if (!nuevaSexo) {
            return res.status(500).json({ message: 'Error al crear el sexo' });
        }

        const historial = await createHistorial(
            'create',
            'Sexo',
            'nombre',
            null,
            nombre,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(201).json({
            message: 'Sexo creado exitosamente',
            data: nuevaSexo
        });

    } catch (error) {
        console.error('Error al crear el sexo:', error);
        return res.status(500).json({ message: 'Error al crear el sexo', error });
    }
};

const updateSexoHandler = async (req, res) => {

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
        const previo = await getSexo(id);
        const response = await updateSexo(id, { nombre });
        if (!response) {
            return res.status(404).json({
                message: "El sexo no se encuentra",
                data: {}
            });
        }

        const historial = await createHistorial(
            'update',
            'Sexo',
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
        console.error('Error al modificar el sexo:', error);
        return res.status(500).json({ message: "Error al modificar el sexo", error });
    }
};

const deleteSexoHandler = async (req, res) => {

    const id = req.params.id;
    const token = req.user;

    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la función para eliminar (estado a inactivo)
        const response = await deleteSexo(id);
        if (!response) {
            return res.status(204).json({
                message: `No se encontró la Sexo con ID${id}`
            })
        }

        const historial = await createHistorial(
            'delete',
            'Sexo',
            'nombre',
            response.nombre,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Sexo eliminado correctamente '
        });

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getSexosHandler,
    getSexoHandler,
    createSexoHandler,
    updateSexoHandler,
    deleteSexoHandler
}

