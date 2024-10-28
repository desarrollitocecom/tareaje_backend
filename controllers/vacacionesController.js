const {sequelize} = require("../db_connection.js")
const Vacaciones=require('../models/Vacaciones')
const Empleado=require('../models/Empleado')
const getVacaciones = async () => {
  try {
    const response = await Vacaciones(sequelize).findAll({
      where: { state: true },
      include: [{
        model: Empleado(sequelize),
        as: "empleado"
      }]
    });
    return response || null;
  } catch (error) {
    console.error("Error al traer todas las Vacaciones", error)
    return false;
  }
};

const createVacaciones = async (f_inicio, f_fin, id_empleado) => {
  try {
    
    const newVacaciones = await Vacaciones(sequelize).create({
      f_inicio:f_inicio,
      f_fin:f_fin,
      id_empleado:id_empleado,
    });
    return newVacaciones || null;
  } catch (error) {
    console.error({
      message: "Error al Crear nueva Vacacion",
      data: error,
    });
  }
};
const getVacacion = async (id) => {

  try {
    const response = await Vacaciones.findOne({
      where: { state: true },
      id,
      include: {
        model: Empleado,
        as: "empleado",
      },
    });
    return response || null;
  } catch (error) {
    console.error({
      message: "Erroe al traer una vacacion",
      data: error,
    });
    return false;
  }
};
const deleteVaciones = async (id) => {
  try {
    const response = await Vacaciones.findByPk(id);
    response.state = false;
    await response.save();
    return response || null;
  } catch (error) {
    console.error(
      "Error al canbiar de estado al eliminar Sexo en el controlador"
    );
    return false;
  }
};
const updateVacaciones = async (id, f_inicio, f_fin, id_empleado) => {
  try {
    const response = await getVacacion(id);
    if (response) await response.update(f_inicio, f_fin, id_empleado);
    return response || null;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  getVacacion,
  getVacaciones,
  createVacaciones,
  deleteVaciones,
  updateVacaciones,
};
