const { Descanso, Empleado } = ("../db_connection.js");

const getAllDescansos = async () => {
    try {
        const response = await Descanso.findAll({
            include: [{ model: Empleado, as: 'empleado', attributes: ['id', 'nombre'] }]
        });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Descansos", data: error });
        return false
    }
};
const getDescansos = async (id) => {
    try {
        const response = await Descanso.findOne({
            include: [{ model: Empleado, as: 'empleado', attributes: ['id', 'nombre'] }]
        })
        return response || null
    } catch (error) {
        console.error({ message: "Error en el controlador al traer el Descanso", data: error });
        return false
    }
}
const createDescansos = async ({ fecha, observacion, id_empleado }) => {
    try {
        const response = await Descanso.create({ fecha, observacion, id_empleado });
        return response || null
    } catch (error) {
        console.error({ message: "Error en el controlador al crear el Descanso", data: error });
        return false
    }
}
const deleteDescanso = async (id) => {
    try {
        const response = await findByPk(id);
        response.state = false;
        await response.save();
        return response || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Descanso', error);
        return false;
    }
};
const updateDescanso = async (id, { fecha, observacion, id_empleado }) => {
    try {
        const response = await getDescansos(id);
        if (response) await response.update({ fecha, observacion, id_empleado });
        return response || null;
    } catch (error) {
        console.error("Error al modificar el descanso en el controlador:", error);
        return false;
    }
};
module.exports = {
    getAllDescansos,
    getDescansos,
    updateDescanso,
    createDescansos,
    deleteDescanso
}