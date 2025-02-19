const { Empleado, Vacacion } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener una vacación con atributos del empleado :
const getVacacion = async (id) => {

    try {
        const response = await Vacacion.findOne({
            where: { id, state: true },
            include: { model: Empleado, as: 'empleado', attributes: ['id', 'nombres', 'apellidos', 'dni'] },
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener una vacación con atributos del empleado por ID',
            error: error.message,
        });
        return false;
    }
};

// Obtener una vacación con atributos del empleado :
const getVacacionById = async (id) => {

    try {
        const response = await Vacacion.findOne({
            where: { id, state: true }
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener una vacación por ID',
            error: error.message,
        });
        return false;
    }
};

// Obtener todas las vacaciones con paginación :
const getVacaciones = async (page = 1, limit = 20) => {
    
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
          const response = await Vacacion.findAndCountAll({
              where: { state: true },
              include: [{ model: Empleado, as: 'empleado', attributes: ['id', 'nombres', 'apellidos', 'dni']}],
              limit,
              offset,
              order: [['id', 'ASC']]
          });

          return {
              totalCount: response.count,
              data: response.rows,
              currentPage: page
          } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todas las vacaciones',
            error: error.message
        });
        return false;
    }
};

// Obtener el ID de los empleados que tengan vacación en una fecha determinada :
const getVacacionDiaria = async (fecha) => {

    try {
        const response = await Vacacion.findAll({
            where: {
                state: true,
                f_inicio: { [Op.lte]: fecha },
                f_fin: { [Op.gte]: fecha }
            },
            attributes: ['id_empleado'],
            raw: true
        });
        
        if (!response) return null;
        const result = response.map(r => r.id_empleado);
        return result;
      
    } catch (error) {
        console.error('Error al obtener las vacaciones en un día:', error);
        return false;
    }
};

// Crear una vacación :
const createVacacion = async (f_inicio, f_fin, id_empleado, before) => {

    try {
        const response = await Vacacion.create({ f_inicio, f_fin, id_empleado, before });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear la vacación',
            error: error.message
        });
        return false;
    }
};

// Actualizar una vacación :
const updateVacacion = async (id, f_inicio, f_fin, id_empleado, before) => {

    try {
        const response = await Vacacion.findByPk(id);
        if (response) await response.update({ f_inicio, f_fin, id_empleado, before });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar la vacación',
            error: error.message
        });
        return false;
    }
};

// Eliminar una vacación :
const deleteVacacion = async (id) => {

    try {
        const response = await Vacacion.findByPk(id);
        if (!response) return null;
        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar la vacación',
            error: error.message
        });
        return false;
    }
};

module.exports = {
  getVacacion,
  getVacacionById,
  getVacaciones,
  getVacacionDiaria,
  createVacacion,
  deleteVacacion,
  updateVacacion,
};
