const {
  updateVacaciones,
  deleteVaciones,
  getVacacion,
  getVacaciones,
  createVacaciones,
} = require("../controllers/vacacionesController.js");
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
  const {page,limit}=req.query;
  try {
    const respuesta = await getVacaciones(Number(page),Number(limit));
    if(response.length === 0 || page>limit){
      return res.status(200).json(
          {message:'Ya no hay mas descansos',
           data:{
              data:[],
              totalPage:response.currentPage,
              totalCount:response.totalCount
           }   
          }
      );
  }
    return res.status(200).json({
      message: "Todas las Vacaciones",
      data: respuesta,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json(error);
  }
};
const createVacacionesHandler = async (req, res) => {
  const { f_inicio}= req.body;
  const { f_fin}= req.body;
  const {id_empleado} = req.body;

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
    const response=await updateVacaciones(id ,{f_inicio}, {f_fin}, {id_empleado});
    if (!response) {
      return res.status(404).json({
        message: 'Vacación no se puedo moficar  encontrada.',
        data: []
      });
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
