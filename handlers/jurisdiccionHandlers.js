const { getJurisdicciones,
    createJurisdiccion,
    getJurisdiccion,
    updateJurisdiccion,
    deleteJurisdiccion
} = require('../controllers/JurisdiccionController');

//Handlers para obtener las Jurisdicciones
const getJurisdiccionesHandler = async (req, res) => {
    const {page=1,limit=20}=req.query;
    const errores = [];
    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page <= 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if(errores.length>0){
        return res.status(400).json({ errores });
    }
    try {
        const response = await getJurisdicciones(Number(page),Number(limit));
        if(response.length === 0 || page>limit){
            return res.status(200).json(
                {message:'Ya no hay mas Jurisdicciones',
                 data:{
                    data:[],
                    totalPage:response.currentPage,
                    totalCount:response.totalCount
                 }   
                }
            );
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
        const nuevaJurisdiccion = await createJurisdiccion({ nombre });
        return res.status(201).json({
            message: 'Jurisdicción creada exitosamente',
            data: nuevaJurisdiccion
        });
    } catch (error) {
        console.error('Error al crear la jurisdicción:', error);
        return res.status(500).json({ message: 'Error al crear la jurisdicción', error });
    }
};

// Handler para modificar una Jurisdicción
const updateJurisdiccionHandler = async (req, res) => {
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
        const response = await updateJurisdiccion(id, { nombre });
        if (!response) {
            return res.status(404).json({
                message: "La Jurisdicción no se encuentra",
                data: {}
            });
        }
        return res.status(200).json({
            message: "Registro modificado",
            data: response
        });
    } catch (error) {
        console.error('Error al modificar la jurisdicción:', error);
        return res.status(500).json({ message: "Error al modificar la jurisdicción", error });
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
