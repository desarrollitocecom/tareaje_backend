const {
  updateVacaciones,
  deleteVaciones,
  getVacacion,
  getVacaciones,
  createVacaciones,
} = require("../controllers/vacacionesController.js");

const { createHistorial } = require('../controllers/historialController');

const getVacacionHandler = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res
      .status(400)
      .json({ message: "El ID es requerido y debe ser un Numero" });
  }
  try {
    const response = await getVacacion(id);
    if (!response) {
      return res.status(404).json({ error: "Vacación no encontrada." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la vacación." });
  }
};
const getVacacionesHandler = async (req, res) => {

  const { page = 1, limit = 20  } = req.query;
  const errores = [];

  if (isNaN(page)) errores.push("El page debe ser un numero");
  if (page < 0) errores.push("El page debe ser mayor a 0 ");
  if (isNaN(limit)) errores.push("El limit debe ser un numero");
  if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");

  if (errores.length > 0) return res.status(400).json({
      message: 'Se encontraron los siguientes errores...',
      data: errores,
  });

  const numPage = parseInt(page);
  const numLimit = parseInt(limit);

  try {
      const response = await getVacaciones(numPage, numLimit);
      const totalPages = Math.ceil(response.totalCount / numLimit);

      if(numPage > totalPages){
          return res.status(200).json({
              message:'Página fuera de rango...',
              data:{
                  data:[],
                  currentPage: numPage,
                  pageCount: response.data.length,
                  totalCount: response.totalCount,
                  totalPages: totalPages,
               }
              }
          );
      }
      
      return res.status(200).json({
          message: 'Vacaciones obtenidas exitosamente...',
          data: {
              data: response.data,
              currentPage: numPage,
              pageCount: response.data.length,
              totalCount: response.totalCount,
              totalPages: totalPages,
          }
      });
      
  } catch (error) {
      console.error('Error al obtener todas las vacaciones en el handler', error);
      return res.status(500).json({ message: "Error al obtener todas las vacaciones en el handler" });
  }
};

const createVacacionesHandler = async (req, res) => {

  const { f_inicio}= req.body;
  const { f_fin}= req.body;
  const {id_empleado} = req.body;
  const token = req.user;

  if (!id_empleado || isNaN(id_empleado)) {
    return res
      .status(400)
      .json({ message: "El ID es requerido y debe ser un Numero" });
  }
  console.log("id_emple:" + id_empleado);
  if (!Date.parse(f_inicio) || !Date.parse(f_fin)) {
    return res.status(400).json({
      message:
        "Fechas inválidas. Asegúrate de usar el formato correcto (YYYY-MM-DD).",
      data: [],
    });
  }

  // Validar que la fecha de inicio sea anterior o igual a la fecha de fin
  if (new Date(f_inicio) > new Date(f_fin)) {
    return res.status(400).json({
      message: "La fecha de inicio no puede ser posterior a la fecha de fin.",
      data: [],
    });
  }

  
  try {
    const newVacaciones = await createVacaciones({f_inicio, f_fin, id_empleado});
    
    if (!newVacaciones)
      return res.status(203).json({
        message: "La vacacion  no se creo",
        data: [],
      });

    const historial = await createHistorial(
        'create',
        'Vacacion',
        'f_inicio, f_fin, id_empleado',
        null,
        `${f_inicio}, ${f_fin}, ${id_empleado}`,
        token
    );
    if (!historial) console.warn('No se agregó al historial...');

    return res.status(200).json({
      message: "nueva vacaion Creada con Exito",
      data: newVacaciones,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear una Vacacion en el Handlers create",
      data: error,
    });
  }
};


const deleteVacacionesHandler = async (req, res) => {

  const { id } = req.params;
  const token = req.user;

  if (!id || isNaN(id)) {
    return res
      .status(400)
      .json({ message: "El ID es requerido y debe ser un Numero" });
  }
  try {
    const response = await deleteVaciones(id);
    if (!response)
      return res.status(204).json({
        message: `No se encontró la vacacion con ID${id}`,
      });

    const historial = await createHistorial(
        'delete',
        'Vacacion',
        'f_inicio, f_fin, id_empleado',
        `${response.f_inicio}, ${response.f_fin}, ${response.id_empleado}`,
        null,
        token
    );
    if (!historial) console.warn('No se agregó al historial...');

    return res.status(200).json({
      message: "Vacacion eliminada correctamente (estado cambiado a inactivo)",
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
const updateVacacionesHandler=async (req,res) => {

  const { id } = req.params; // ID de la vacación a actualizar
  const { f_inicio, f_fin, id_empleado } = req.body;
  const token = req.user;

  // Validación de fechas
  if (!Date.parse(f_inicio) || !Date.parse(f_fin)) {
    return res.status(400).json({
      message: 'Fechas inválidas. Asegúrate de usar el formato correcto (YYYY-MM-DD).',
      data: []
    });
  }

  if (new Date(f_inicio) > new Date(f_fin)) {
    return res.status(400).json({
      message: 'La fecha de inicio no puede ser posterior a la fecha de fin.',
      data: []
    });
  }
  try {
    const previo = await getVacacion(id);
    const response = await updateVacaciones(id ,f_inicio, f_fin, id_empleado);
    if (!response) {
      return res.status(404).json({
        message: 'Vacación no se puedo moficar  encontrada.',
        data: []
      });
    }

    const anterior = [previo.f_inicio, previo.f_fin, previo.id_empleado];
    const nuevo = [f_inicio, f_fin, id_empleado];
    const campos = ['f_inicio', 'f_fin', 'id_empleado'];
    let historial;

    for (let i = 0; i < anterior.length; i++) {
        if (anterior[i] !== nuevo[i]) {
            historial = await createHistorial(
                'update',
                'Vacacion',
                campos[i],
                anterior[i],
                nuevo[i],
                token
            );
            if (!historial) console.warn('No se agregó al historial...');
        }
    }

    return res.status(200).json({
        message:"Vacacion modificada",
        data:response

    })
    
  } catch (error) {
    return res.status(500).json({
      message: 'Error en el handler de actualización de vacación.',
      data: error.message
    });
  }
  
}

module.exports = {
  createVacacionesHandler,
  getVacacionesHandler,
  getVacacionHandler,
  deleteVacacionesHandler,
  updateVacacionesHandler
};
