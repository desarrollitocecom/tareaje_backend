const {
  createObservacion,
  getAllObservaciones,
  getObservacion,
  updateObservacion,
  deleteObservacion,
} = require("../controllers/observacionController");

const getAllObservacionHandler = async (req, res) => {
  try {
    const observaciones = await getAllObservaciones();
    res.status(200).json(observaciones);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      statusCode: 400,
    });
  }
};

const getObservacionHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const observacion = await getObservacion(id);
    res.status(200).json(observacion);
  } catch (error) {
    res.status(404).json({
      message: `No se encontró la observación con ID: ${id}`,
      statusCode: 404,
    });
  }
};

const createObservacionHandler = async (req, res) => {
  const { comentario, lat, long, ubicacion, consultaStatus } = req.body;
  const photo = req.file;

  const observacionData = {
    comentario,
    consultaStatus,
    lat,
    long,
    fotos: [photo.filename],
  };

  if(ubicacion) observacionData.ubicacion = ubicacion;

  try {
    const observacion = await createObservacion(observacionData);
    res.status(201).json(observacion);
  } catch (error) {
    res.status(404).json({
      message: error.message,
      statusCode: 404,
    });
  }
};

const updateObservacionHandler = async (req, res) => {
  const { id } = req.params;

  if (!req.body)
    res.status(200).json({
      message: "No se encontrò cambios",
      statusCode: 200,
    });

  const { comentario, lat, long, estado, ubicacion, consultaStatus } = req.body;
  let updateData = {};

  if (comentario) updateData.comentario = comentario;
  if (lat) updateData.lat = lat;
  if (long) updateData.long = long;
  if (long) updateData.estado = estado;
  if (ubicacion) updateData.ubicacion = ubicacion;
  if (consultaStatus) updateData.consultaStatus = consultaStatus;


  try {
    const observacion = await updateObservacion(id, updateData);
    res.status(200).json(observacion);
  } catch (error) {
    res.status(404).json({
      message: error.message,
      statusCode: 404,
    });
  }
};

const deleteObservacionHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deletemsg = await deleteObservacion(id);
    res.status(200).json({
      message: deletemsg,
      statusCode: 200,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      statusCode: 404,
    });
  }
};

module.exports = {
  getAllObservacionHandler,
  getObservacionHandler,
  createObservacionHandler,
  updateObservacionHandler,
  deleteObservacionHandler,
};
