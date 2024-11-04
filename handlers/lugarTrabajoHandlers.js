const {
    getLugarTrabajos,
    createLugarTrabajo,
    getLugarTrabajo,
    updateLugarTrabajo,
    deleteLugarTrabajo
} = require('../controllers/lugarTrabajoController');

//Handlers para obtener las LugarTrabajoes
const getLugarTrabajosHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page <= 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if(errores.length>0){
        return res.status(400).json({ errores });
    }
    try {
        const response = await getLugarTrabajos(Number(page), Number(limit));
        if (response.length === 0 || page > limit) {
            return res.status(200).json(
                {
                    message: 'Ya no hay mas lugares de trabajo',
                    data: {
                        data: [],
                        totalPage: response.currentPage,
                        totalCount: response.totalCount
                    }
                }
            );
        }
        return res.status(200).json({
            message: 'Son los Lugar Trabajos',
            data: response
        })
    } catch (error) {
        console.error('Error al obtener todas los Lugar de Trabajos ', error)
        return res.status(500).json({ message: "Error al obtener todas las Lugar de trabajo" })
    }
}
//Handlers para obtener una LugarTrabajo 
const getLugarTrabajoHandler = async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await getLugarTrabajo(id);

        if (!response || response.length === 0) {
            return res.status(404).json({
                message: "Lugares de trabajo no encontrado",
                data: []
            });
        }

        return res.status(200).json({
            message: "Lugares de trabajo encontrada",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al buscar la Lugares de trabajo",
            error: error.message
        });
    }
};
//handlers para crear una nueva LugarTrabajo

const createLugarTrabajoHandler = async (req, res) => {
    const { nombre } = req.body;

    const validaNombre = /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(nombre);


    if (!nombre || typeof nombre !== 'string' || !validaNombre)
        return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena de texto válida y tener solo letras' });

    try {
        const nuevaLugarTrabajo = await createLugarTrabajo({ nombre })

        res.status(201).json(nuevaLugarTrabajo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messaje: 'Error del server' })
    }
}
//handler para modificar una LugarTrabajo

const updateLugarTrabajoHandler = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const errores = [];
    if (!id || isNaN(id)) {
        errores.push('El ID es requerido y debe ser un Numero')
        console.log('id:' + id);
    }


    if (!nombre || typeof nombre !== 'string') {
        errores.push('El nombre es requerido y debe ser una cadena de texto válida')
    }
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const response = await updateLugarTrabajo(id, { nombre })
        if (!response) {
            return res.status(201).json({
                message: "El lugar trabajo no se encuentra ",
                data: {}
            })
        }
        return res.status(200).json({
            message: "Registro modificado",
            data: response
        })
    } catch (error) {
        res.status(404).json({ message: "Lugar de Trabajo no encontrada", error })
    }
};
const deleteLugarTrabajoHandler = async (req, res) => {
    const id = req.params.id;
    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la función para eliminar (estado a inactivo)
        const response = await deleteLugarTrabajo(id);

        if (!response) {
            return res.status(204).json({
                message: `No se encontró la Lugar de Trabajo con ID${id}`
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
    getLugarTrabajosHandler,
    getLugarTrabajoHandler,
    createLugarTrabajoHandler,
    updateLugarTrabajoHandler,
    deleteLugarTrabajoHandler
}

