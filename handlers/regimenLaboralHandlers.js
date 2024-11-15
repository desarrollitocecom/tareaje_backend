const { getRegimenLaborales,
    createRegimenLaboral,
    getRegimenLaboral,
    updateRegimenLaboral,
    deleteRegimenLaboral
} = require('../controllers/RegimenLaboralController');

//Handlers para obtener las RegimenLaborales
const getRegimenLaboralesHandler = async (req, res) => {
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
        const response = await getRegimenLaborales(Number(page), Number(limit));

        // Si no hay datos, devuelve un mensaje con estado 200
        if (response.length === 0 || page > limit) {
            return res.status(200).json(
                {
                    message: 'Ya no hay mas regimen laborales',
                    data: {
                        data: [],
                        totalPage: response.currentPage,
                        totalCount: response.totalCount
                    }
                }
            );
        }

        // Si hay datos, devuélvelos con el mensaje correspondiente
        return res.status(200).json({
            message: 'Son las Regimen Laborales',
            data: response
        });
    } catch (error) {
        console.error('Error al obtener todas los Regimen Laborales:', error);
        return res.status(500).json({ message: "Error al obtener todas las Regimen Laborales" });
    }
};
//Handlers para obtener una RegimenLaboral 
const getRegimenLaboralHandler = async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await getRegimenLaboral(id);

        if (!response || response.length === 0) {
            return res.status(404).json({
                message: "Regimen Laboral no encontrada",
                data: []
            });
        }

        return res.status(200).json({
            message: "Regimen Laboral encontrada",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al buscar la Regimen Laboral",
            error: error.message
        });
    }
};
//handlers para crear una nueva RegimenLaboral

const createRegimenLaboralHandler = async (req, res) => {
    const { nombre } = req.body;
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
        const nuevaRegimenLaboral = await createRegimenLaboral({ nombre });
        return res.status(201).json({
            message: 'Régimen Laboral creado exitosamente',
            data: nuevaRegimenLaboral
        });
    } catch (error) {
        console.error('Error al crear el Régimen Laboral:', error);
        return res.status(500).json({ message: 'Error al crear el Régimen Laboral', error });
    }
};

const updateRegimenLaboralHandler = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
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
        const response = await updateRegimenLaboral(id, { nombre });
        if (!response) {
            return res.status(404).json({
                message: "El Régimen Laboral no se encuentra",
                data: {}
            });
        }
        return res.status(200).json({
            message: "Registro modificado",
            data: response
        });
    } catch (error) {
        console.error('Error al modificar el Régimen Laboral:', error);
        return res.status(500).json({ message: "Error al modificar el Régimen Laboral", error });
    }
};

const deleteRegimenLaboralHandler = async (req, res) => {
    const id = req.params.id;
    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la Regimen Laboral para eliminar (estado a inactivo)
        const response = await deleteRegimenLaboral(id);

        if (!response) {
            return res.status(200).json({
                message: `No se encontró el Regimen Laboral con ID : ${id}`,
                data: {}
            })
        }
        return res.status(200).json({
            message: 'Regimen Laboral eliminada correctamente'
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getRegimenLaboralesHandler,
    getRegimenLaboralHandler,
    createRegimenLaboralHandler,
    updateRegimenLaboralHandler,
    deleteRegimenLaboralHandler
}

