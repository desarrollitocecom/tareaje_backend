const {
    createlugarTrabajo,
    readlugarTrabajo,
    UpdatelugarTrabajo,
    deletelugarTrabajo
}=require('../controllers/lugartrabajoController');

const CrearlugarTrabajoHander = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string')
        return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena de texto válida' });
    try {
        const nuevolugarTrabajo = await createlugarTrabajo({ nombre })

        res.status(201).json(nuevolugarTrabajo);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ messaje: 'Error del server' })
    }
}

const ReadlugarTrabajoHander = async (req, res) => {
    // entender que se debe buscar todos los nombresporlugarTrabajo como un where
    const nombrelugarTrabajo = req.params.nombre;
    const validaNombre = /^[a-zA-Z]+$/.test(nombrelugarTrabajo);

    if (!validaNombre) {
        return res.status(400).json({ message: 'El nombre de la lugarTrabajo es inválido. Debe contener solo letras.' });
    }

    try {
        const BuscaellugarTrabajo = await readlugarTrabajo(nombrelugarTrabajo);

        if (!BuscaellugarTrabajo || BuscaellugarTrabajo.length === 0) {
            return res.status(404).json({
                message: "lugarTrabajo no encontrado",
                data: []
            });
        }

        return res.status(200).json({
            message: "lugarTrabajo encontrado",
            data: BuscaellugarTrabajo
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al buscar la función",
            error: error.message
        });
    }
};
const UpdatelugarTrabajoHanderls = async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    const errores = [];
    if (!id || isNaN(id)) {
        errores.push('El ID es requerido y debe ser un Numero')
       
    }
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        errores.push('El nombre es requerido y debe ser una cadena de texto válida')
    }
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const response = await UpdatelugarTrabajo(id, nombre)
        res.status(201).json({
            message: 'lugarTrabajo Modificado',
            data: response
        })
    } catch (error) {
        res.status(404).json({ message: "lugarTrabajo no encontrado" })
    }
};
const DeletelugarTrabajoHandler = async (req, res) => {
    const id = req.params.id; // Convertir id a número


    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la función para eliminar (estado a inactivo)
        await deletelugarTrabajo(id);
        res.status(200).json({
            message: 'lugarTrabajo eliminado correctamente (estado cambiado a inactivo)'
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
module.exports = {
    CrearlugarTrabajoHander,
    ReadlugarTrabajoHander,
    UpdatelugarTrabajoHanderls,
    DeletelugarTrabajoHandler
}