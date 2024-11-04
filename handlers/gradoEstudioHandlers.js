const {
    getGradoEstudios,
    createGradoEstudio,
    getGradoEstudio,
    updateGradoEstudio,
    deleteGradoEstudio
} = require('../controllers/gradoestudioController');

// Handler para obtener todas las GradoEstudioes
const getGradoEstudiosHandler = async (req, res) => {
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
        const response = await getGradoEstudios(Number(page),Number(limit));
        
        // Si no hay datos, devuelve un mensaje con estado 200
        if(response.length === 0 || page>limit){
            return res.status(200).json(
                {message:'Ya no hay mas Grados de Estudios',
                 data:{
                    data:[],
                    totalPage:response.currentPage,
                    totalCount:response.totalCount
                 }   
                }
            );
        }

        // Si hay datos, devuélvelos con el mensaje correspondiente
        return res.status(200).json({
            message: 'Son las Grado de Estudios',
            data: response
        });
    } catch (error) {
        console.error('Error al obtener todas las Grado de Estudios en el handler:', error);
        return res.status(500).json({ message: "Error al obtener todas las Grado de Estudios" });
    }
};
// Handler para obtener una GradoEstudio por ID
const getGradoEstudioHandler = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un número válido' });
    }

    try {
        const response = await getGradoEstudio(id);

        if (!response) {
            return res.status(404).json({
                message: "Grado de Estudios no encontrada",
                data: []
            });
        }

        return res.status(200).json({
            message: "Grado de Estudios encontrada",
            data: response
        });
    } catch (error) {
        console.error('Error al buscar la Grado de Estudios:', error);
        return res.status(500).json({
            message: "Error al buscar la Grado de Estudios",
            error: error.message
        });
    }
};

// Handler para crear una nueva GradoEstudio
const createGradoEstudioHandler = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string' || !/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(nombre)) {
        return res.status(400).json({ error: 'El nombre es requerido y debe contener solo letras y espacios' });
    }

    try {
        const nuevaGradoEstudio = await createGradoEstudio({ nombre });
        return res.status(201).json({
            message: 'GradoEstudio creada exitosamente',
            data: nuevaGradoEstudio
        });
    } catch (error) {
        console.error('Error al crear la GradoEstudio:', error);
        return res.status(500).json({ message: 'Error al crear la GradoEstudio' });
    }
};

// Handler para modificar una GradoEstudio
const updateGradoEstudioHandler = async (req, res) => {
    const {id} = req.params;
    const  {nombre}  = req.body;
    const errores = [];
    if (!id || isNaN(id)) {
        errores.push('El ID es requerido y debe ser un Numero')
        console.log('id:' + id);
    }
   
    
    if (!nombre || typeof nombre !== 'string' ) {
        errores.push('El nombre es requerido y debe ser una cadena de texto válida')
    }
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const response = await updateGradoEstudio(id, {nombre})
        if (!response) {
            return res.status(201).json({
                message: "El Grado de Estudio no se encuentra ",
                data: {}
            })
        }
        return res.status(200).json({
            message: "Registro modificado",
            data: response
        })
    } catch (error) {
        res.status(404).json({ message: "Grado de Estudio no encontrado",error})
    }
 };

// Handler para eliminar una GradoEstudio (cambiar estado a inactivo)
const deleteGradoEstudioHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await deleteGradoEstudio(id);

        if (!response) {
            return res.status(404).json({
                message: `No se encontró el Grado de Estudio con ID:${id}`
            });
        }
        return res.status(200).json({
            message: 'Grado de Estudio eliminada correctamente ',
            data:{}
        });
    } catch (error) {
        console.error('Error al eliminar la Grado de Estudio:', error);
        return res.status(500).json({ message: "Error al eliminar la Grado de Estudio" });
    }
};

module.exports = {
    getGradoEstudiosHandler,
    getGradoEstudioHandler,
    createGradoEstudioHandler,
    updateGradoEstudioHandler,
    deleteGradoEstudioHandler
};
