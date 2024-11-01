const { getSexos,
    createSexo,
    getSexo,
    updateSexo,
    deleteSexo
} = require('../controllers/sexoController');

//Handlers para obtener las Sexoes
const getSexosHandler = async (req, res) => {
    const { page = 1 , pageSize = 20 } = req.query;
    try {
        const response = await getSexos(page, pageSize);
        if (!response.length) {
            res.status(204).send();
        }
        return res.status(200).json({
            message: 'Son las Sexoes',
            data: response
        })
    } catch (error) {
        console.error('Error al obtener todas las Sexoes en el handlers', error)
        return res.status(500).json({ message: "Error al obtener todas las Sexoes en el handlers" })
    }
}
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
//handlers para crear una nueva Sexo

const createSexoHandler = async (req, res) => {
    const { nombre } = req.body;

    const validaNombre = /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(nombre);


    if (!nombre || typeof nombre !== 'string' || !validaNombre)
        return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena de texto válida y tener solo letras' });

    try {
        const nuevaSexo = await createSexo({ nombre })

        res.status(201).json(nuevaSexo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messaje: 'Error del server' })
    }
}
//handler para modificar una Sexo

const updateSexoHandler = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const errores = [];
    if (!id || isNaN(id)) {
        errores.push('El ID es requerido y debe ser un Numero')
        console.log('id:' + id);
    }
    console.log("name" + nombre);

    if (!nombre || typeof nombre !== 'string') {
        errores.push('El nombre es requerido y debe ser una cadena de texto válida')
    }
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const response = await updateSexo(id, { nombre })
        if (!response) {
            return res.status(201).json({
                message: "El sexo no se encuentra ",
                data: {}
            })
        }

        return res.status(200).json({
            message: "Reguistro modificado",
            data: response
        })
    } catch (error) {
       return res.status(404).json({ message: "Sexo no encontrada", error })
    }
};
const deleteSexoHandler = async (req, res) => {
    const id = req.params.id;
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
        return res.status(200).json({
            message: 'Función eliminada correctamente (estado cambiado a inactivo)'
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

