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
const UpdateFuncionHanderls = async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    const errores = [];
    if (!id || isNaN(id)) {
        errores.push('El ID es requerido y debe ser un Numero')
        console.log('id:' + id);
    }
    if (!nombre || typeof nombre !== 'string'|| nombre.trim() === '') {
        errores.push('El nombre es requerido y debe ser una cadena de texto válida')
    }
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const response = await UpdateFuncion(id, nombre)
        res.status(201).json({
            message: 'Funcion Modificada',
            data: response
        })
    } catch (error) {
        res.status(404).json({ message: "Funcion no encontrada" })
    }
};
const DeleteFuncionHandler = async (req, res) => {
    const id = req.params.id; // Convertir id a número
    

    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message:'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la función para eliminar (estado a inactivo)
        await deleteFuncion(id);
        res.status(200).json({
            message: 'Función eliminada correctamente (estado cambiado a inactivo)'
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    CrearFuncionHander,
    ReadFuncionHander,
    UpdateFuncionHanderls,
    DeleteFuncionHandler
}

