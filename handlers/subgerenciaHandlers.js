const { getSubgerencias,
    createSubgerencia,
    getSubgerencia,
    updateSubgerencia,
    deleteSubgerencia
} = require('../controllers/subgerenciaController');

//Handlers para obtener las Subgerenciaes
const getSubgerenciasHandler = async (req, res) => {
    try {
        const response = await getSubgerencias();
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

    const validaNombre = /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(nombre);


    if (!nombre || typeof nombre !== 'string' || !validaNombre)
        return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena de texto válida y tener solo letras' });

    try {
        const nuevaSubgerencia = await createSubgerencia({ nombre })

        res.status(201).json(nuevaSubgerencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messaje: 'Error del server' })
    }
}
//handler para modificar una Subgerencia

const updateSubgerenciaHandler = async (req, res) => {
    const {id} = req.params;
    const  {nombre}  = req.body;
    const errores = [];
    if (!id || isNaN(id)) {
        errores.push('El ID es requerido y debe ser un Numero')
    }
    if (!nombre || typeof nombre !== 'string' ) {
        errores.push('El nombre es requerido y debe ser una cadena de texto válida')
    }
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const response = await updateSubgerencia(id, {nombre})
        if (!response) {
            return res.status(201).json({
                message: "La Subgerencia no se encuentra ",
                data: {}
            })
        }
        return res.status(200).json({
            message: "Registro modificado",
            data: response
        })
    } catch (error) {
        res.status(404).json({ message: "Subgerencia no encontrada",error})
    }
};
const deleteSubgerenciaHandler = async (req, res) => {
    const id = req.params.id;
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