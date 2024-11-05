//const {sequelize} = require("../db_connection.js")
const { Empleado, Vacacion } = require('../db_connection')

const getVacaciones = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  try {
    const response = await Vacacion.findAndCountAll({
      where: { state: true },
      include: [{
        model: Empleado,
        as: "empleado"
      }],
      limit,
      offset
    });
    return { totalCount: response.count, data: response.rows, currentPage: page } || null;
  } catch (error) {
    console.error("Error al traer todas las Vacaciones", error)
    return false;
  }
};

const createVacaciones = async ({ f_inicio, f_fin, id_empleado }) => {

  try {

    const newVacaciones = await Vacacion.create({
      f_inicio: f_inicio,
      f_fin: f_fin,
      id_empleado: id_empleado
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
    const response = await Vacacion.findOne({
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
    const response = await Vacacion.findByPk(id);
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
