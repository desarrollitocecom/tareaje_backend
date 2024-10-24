const { createFuncion, readFuncion, UpdateFuncion, deleteFuncion } = require('../controllers/ControllersFuncion');

const CrearFuncionHander = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string')
        return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena de texto válida' });
    try {
        const nuevofuncion = await createFuncion({ nombre })

        res.status(201).json(nuevofuncion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messaje: 'Error del server' })
    }
}

const ReadFuncionHander = async (req, res) => {
    // entender que se debe buscar todos los nombresporfuncion como un where
    const nombrefuncion = req.params.nombre;
    const validaNombre = /^[a-zA-Z]+$/.test(nombrefuncion);

    if (!validaNombre) {
        return res.status(400).json({ message: 'El nombre de la Funcion es inválido. Debe contener solo letras.' });
    }

    try {
        const BuscalaFuncion = await readFuncion(nombrefuncion);
        
        if (!BuscalaFuncion || BuscalaFuncion.length === 0) {
            return res.status(404).json({
                message: "Función no encontrada",
                data: []
            });
        }

        return res.status(200).json({
            message: "Función encontrada",
            data: BuscalaFuncion
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al buscar la función",
            error: error.message
        });
    }
};

module.exports = {
    CrearFuncionHander,
    ReadFuncionHander
}

