const { getSubgerencias,
    createSubgerencia,
    getSubgerencia,
    updateSubgerencia,
    deleteSubgerencia
} = require('../controllers/subgerenciaController');

const { createHistorial } = require('../controllers/historialController');

//Handlers para obtener las Subgerenciaes
const getSubgerenciasHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if(errores.length>0){
        return res.status(400).json({ errores });
    }
    try {
        const response = await getSubgerencias(Number(page), Number(limit));
        if(response.length === 0 || page>limit){
            return res.status(200).json(
                {message:'Ya no hay mas Subgerencias',
                 data:{
                    data:[],
                    totalPage:response.currentPage,
                    totalCount:response.totalCount
                 }   
                }
            );
        }
        return res.status(200).json({
            message: 'Son las Subgerencias',
            data: response
        })
    } catch (error) {
        console.error('Error al obtener todas las Subgerencias ', error)
        return res.status(500).json({ message: "Error al obtener todas las Subgerencias " })
    }
}
//Handlers para obtener una Subgerencia 
const getSubgerenciaHandler = async (req, res) => {
    const id= req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    
    try {
        const response = await getSubgerencia(id);

        if (!response || response.length === 0) {
            return res.status(404).json({
                message: "Subgerencias no encontrada",
                data: []
            });
        }

        return res.status(200).json({
            message: "Subgerencias encontrada",
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
//handlers para crear una nueva Subgerencia

const createSubgerenciaHandler = async (req, res) => {

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
        const nuevaSubgerencia = await createSubgerencia({ nombre });
        if (!nuevaSubgerencia) {
            return res.status(400).json({
                message: 'Subgerencia no creada',
                data: []
            });
        }
        
        const historial = await createHistorial(
            'create',
            'Subgerencia',
            'nombre',
            null,
            nombre,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(201).json({
            message: 'Subgerencia creada exitosamente',
            data: nuevaSubgerencia
        });
        
    } catch (error) {
        console.error('Error al crear la subgerencia:', error);
        return res.status(500).json({ message: 'Error al crear la subgerencia', error });
    }
};

const updateSubgerenciaHandler = async (req, res) => {

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
        const previo = await getSubgerencia(id);
        const response = await updateSubgerencia(id, { nombre });
        if (!response) {
            return res.status(404).json({
                message: "La Subgerencia no se encuentra",
                data: {}
            });
        }

        const historial = await createHistorial(
            'update',
            'Subgerencia',
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
        console.error('Error al modificar la subgerencia:', error);
        return res.status(500).json({ message: "Error al modificar la subgerencia", error });
    }
};

const deleteSubgerenciaHandler = async (req, res) => {

    const id = req.params.id;
    const token = req.user;

    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la función para eliminar (estado a inactivo)
        const response = await deleteSubgerencia(id);
        if (!response) {
            return res.status(204).json({
                message: `No se encontró la Subgerencia con ID${id}`
            })
        }

        const historial = await createHistorial(
            'delete',
            'Subgerencia',
            'nombre',
            response.nombre,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Subgerencia eliminada correctamente'
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getSubgerenciasHandler,
    getSubgerenciaHandler,
    createSubgerenciaHandler,
    updateSubgerenciaHandler,
    deleteSubgerenciaHandler
}