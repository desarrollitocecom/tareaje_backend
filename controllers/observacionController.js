const { Observacion } = require("../db_connection");

const getObservacion = async (observacionId) => {
  try {
    const response = await Observacion.findOne({
      where: { id: observacionId, isDeleted: false },
    });

    if (!response) {
      throw new Error("Observacion no encontrado");
    }
    return response;
  } catch (error) {
    console.error({ data: error.message });
    throw new Error(error.message);
  }
};

const getAllObservaciones = async () => {
  try {
    const response = await Observacion.findAll({
      where: { estado: "ABIERTO", isDeleted: false },
    });

    return response;
  } catch (error) {
    console.error({ data: error.message });
    throw new Error("Error al obtener todas las observaciones");
  }
};

const createObservacion = async (observacion) => {
  try {
    const response = await Observacion.create(observacion);
    return response;
  } catch (error) {
    console.error("Error al crear una nueva observaciòn:", error);
    throw new Error("Error al crear observaciòn");
  }
};

const updateObservacion = async (id, observacionData) => {
  await getObservacion(id);
  try {
    const existingObservacion = await Observacion.findByPk(id);
    
    if (observacionData.fotos) {
      observacionData.fotos = [...new Set([...existingObservacion.fotos, ...observacionData.fotos])];
    }

    const [updated] = await Observacion.update(observacionData, {
      where: { id },
    });

    return await Observacion.findByPk(id);
  } catch (error) {
    console.error({ data: error.message });
    throw new Error("Error al actualizar");
  }
};

const deleteObservacion = async (id) => {
  await getObservacion(id);
  try {
    const deletedCount = await Observacion.update(
      { isDeleted: true },
      {
        where: { id },
      },
    );

    return "Se eliminò correctamente";
  } catch (error) {
    console.error({ data: error.message });
    throw new Error("Error al eliminar");
  }
};

module.exports = {
  getObservacion,
  getAllObservaciones,
  createObservacion,
  updateObservacion,
  deleteObservacion,
};
