const { Descanso, Empleado } = require("../db_connection");

const getAllDescansos = async (page = 1, limit = 20) => {
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;
    try {
        const response = await Descanso.findAndCountAll({
            where: { state: true },
            include: [{ model: Empleado, as: 'empleado', attributes: ['id', 'nombres', 'apellidos', 'dni'], }],
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Descansos", data: error });
        return false
    }
};
const getDescansos = async (id) => {
    try {
        const response = await Descanso.findOne({
            where: { id, state: true },
            include: [{
                model: Empleado,
                as: 'empleado',
                attributes: ['id', 'nombres', 'apellidos']
            }]
        })
        return response || null
    } catch (error) {
        console.error({ message: "Error en el controlador al traer el Descanso", data: error });
        return false
    }
}
const createDescansos = async ({ fecha, tipo, observacion, id_empleado }) => {
    try {
        const response = await Descanso.create({ fecha, tipo, observacion, id_empleado });
        return response || null
    } catch (error) {
        console.error({ message: "Error en el controlador al crear el Descanso", data: error });
        return false
    }
}
const deleteDescanso = async (id) => {
    try {
        // Usa Descanso.findByPk en lugar de findByPk directamente
        const response = await Descanso.findByPk(id);

        if (!response) {
            console.error("Descanso no encontrado");
            return null;
        }

        // Cambia el estado a false en lugar de eliminar el registro
        response.state = false;
        await response.save();

        return response;
    } catch (error) {
        console.error("Error al cambiar de estado al eliminar Descanso", error);
        return false;
    }
};
const updateDescanso = async (id, { fecha, observacion, id_empleado }) => {
    try {
        const response = await getDescansos(id);
        if (response) await response.update({ fecha: fecha, observacion: observacion, id_empleado: id_empleado });
        return response || null;
    } catch (error) {
        console.error("Error al modificar el descanso en el controlador:", error);
        return false;
    }
};

const getDescansosDiario = async (fecha) => {
    
    try {
        const response = await Descanso.findAll({
            where: {
                state: true,
                fecha: fecha
            },
            attributes: ['tipo', 'id_empleado'],
            raw: true
        });

        return response || null;
        
    } catch (error) {
        console.error('Error al obtener los descansos en un día:', error);
        return false;
    }
};

module.exports = {
    getAllDescansos,
    getDescansos,
    getDescansosDiario,
    updateDescanso,
    createDescansos,
    deleteDescanso
}