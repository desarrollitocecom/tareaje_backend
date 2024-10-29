const { getFunciones,
    createFuncion,
    getFuncion,
    updateFuncion,
    deleteFuncion
} = require('../controllers/funcionController');

//Handlers para obtener las funciones
// const getFuncionesHandler = async (req, res) => {
//     try {
//         const response = await getFunciones();
//         if (!response.length) {
//             res.status(204).send();
//         }
//         return res.status(200).json({
//             message: 'Son las funciones',
//             data: response
//         })
//     } catch (error) {
//         console.error('Error al obtener todas las funciones en el handlers', error)
//         return res.status(500).json({ message: "Error al obtener todas las funciones en el handlers" })
//     }
// }
const getFuncionesHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query; // Extraer page y limit de la consulta
    try {
        const response = await getFunciones(Number(page), Number(limit));
        if (!response.data.length) {
            return res.status(204).send(); // Sin contenido
        }
        return res.status(200).json({
            message: 'Son las funciones',
            total: response.total,
            data: response.data
        });
    } catch (error) {
        console.error('Error al obtener todas las funciones en el handler', error);
        return res.status(500).json({ message: "Error al obtener todas las funciones en el handler" });
    }
}
//Handlers para obtener una funcion 
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
//handlers para crear una nueva funcion

const createFuncionHandler = async (req, res) => {
    const { nombre } = req.body;

    const validaNombre = /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(nombre);


    if (!nombre || typeof nombre !== 'string' || !validaNombre)
        return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena de texto válida y tener solo letras' });

    try {
        const nuevaFuncion = await createFuncion({ nombre })

        res.status(201).json(nuevaFuncion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messaje: 'Error del server' })
    }
}
//handler para modificar una funcion

const updateFuncionHandler = async (req, res) => {
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
        const response = await updateFuncion(id, {nombre})
        if (!response) {
            return res.status(201).json({
                message: "La funcion no se encuentra ",
                data: {}
            })
        }
        return res.status(200).json({
            message: "Reguistro modificado",
            data: response
        })
    } catch (error) {
        res.status(404).json({ message: "Funcion no encontrada",error})
    }
};
const deleteFuncionHandler = async (req, res) => {
    const id = req.params.id;
    // Validación del ID
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

