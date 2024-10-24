const {
    createSexo,
    readSexo,
    UpdateSexo,
    deleteSexo
} = require('../controllers/ControllersSexo');

const CrearSexoHander = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string')
        return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena de texto válida' });
    try {
        const nuevoSexo = await createSexo({ nombre })

        res.status(201).json(nuevoSexo);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ messaje: 'Error del server' })
    }
}

const ReadSexoHander = async (req, res) => {
    // entender que se debe buscar todos los nombresporSexo como un where
    const nombreSexo = req.params.nombre;
    const validaNombre = /^[a-zA-Z]+$/.test(nombreSexo);

    if (!validaNombre) {
        return res.status(400).json({ message: 'El nombre de la Sexo es inválido. Debe contener solo letras.' });
    }

    try {
        const BuscaelSexo = await readSexo(nombreSexo);

        if (!BuscaelSexo || BuscaelSexo.length === 0) {
            return res.status(404).json({
                message: "Sexo no encontrado",
                data: []
            });
        }

        return res.status(200).json({
            message: "Sexo encontrado",
            data: BuscaelSexo
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al buscar la función",
            error: error.message
        });
    }
};
const UpdateSexoHanderls = async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    const errores = [];
    if (!id || isNaN(id)) {
        errores.push('El ID es requerido y debe ser un Numero')
        console.log('id:' + id);
    }
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        errores.push('El nombre es requerido y debe ser una cadena de texto válida')
    }
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const response = await UpdateSexo(id, nombre)
        res.status(201).json({
            message: 'Sexo Modificado',
            data: response
        })
    } catch (error) {
        res.status(404).json({ message: "Sexo no encontrado" })
    }
};
const DeleteSexoHandler = async (req, res) => {
    const id = req.params.id; // Convertir id a número


    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la función para eliminar (estado a inactivo)
        await deleteSexo(id);
        res.status(200).json({
            message: 'Sexo eliminado correctamente (estado cambiado a inactivo)'
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
module.exports = {
    CrearSexoHander,
    ReadSexoHander,
    UpdateSexoHanderls,
    DeleteSexoHandler
}