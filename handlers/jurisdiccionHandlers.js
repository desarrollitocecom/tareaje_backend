const { getJurisdicciones,
    createJurisdiccion,
    getJurisdiccion,
    updateJurisdiccion,
    deleteJurisdiccion
} = require('../controllers/JurisdiccionController');

//Handlers para obtener las Jurisdicciones
const getJurisdiccionesHandler = async (req, res) => {
    try {
        const response = await getJurisdicciones();
        if (!response.length) {
            res.status(204).send();
        }
        return res.status(200).json({
            message: 'Son las Jurisdicciones',
            data: response
        })
    } catch (error) {
        console.error('Error al obtener todas las Jurisdicciones en el handlers', error)
        return res.status(500).json({ message: "Error al obtener todas las Jurisdicciones en el handlers" })
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

    const validaNombre = /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(nombre);


    if (!nombre || typeof nombre !== 'string' || !validaNombre)
        return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena de texto válida y tener solo letras' });

    try {
        const nuevaJurisdiccion = await createJurisdiccion({ nombre })

        res.status(201).json(nuevaJurisdiccion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messaje: 'Error del server' })
    }
}
//handler para modificar una Jurisdiccion

const updateJurisdiccionHandler = async (req, res) => {
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
        const response = await updateJurisdiccion(id, {nombre})
        if (!response) {
            return res.status(201).json({
                message: "La Jurisdiccion no se encuentra ",
                data: {}
            })
        }
        return res.status(200).json({
            message: "Registro modificado",
            data: response
        })
    } catch (error) {
        res.status(404).json({ message: "Jurisdiccion no encontrada",error})
    }
};
const deleteJurisdiccionHandler = async (req, res) => {
    const id = req.params.id;
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