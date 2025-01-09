const { Descanso, Empleado, Cargo, Turno, RegimenLaboral } = require("../db_connection");
const { Op } = require('sequelize');

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
};

// Obtener descansos (todos los tipos) en un rango de fechas con filtros :
const getDescansosRango = async (page = 1, limit = 20, inicio, fin, filters = {}) => {

    const { search, subgerencia, turno, cargo, regimen, jurisdiccion, sexo, dni, state } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;
    const dias = [];

    let fechaDate = new Date(inicio);
    while (fechaDate <= new Date(fin)) {
        dias.push(new Date(fechaDate).toISOString().split('T')[0]);
        fechaDate.setDate(fechaDate.getDate() + 1);
    }

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            ...(search && {
                [Op.or]: [
                    { nombres: { [Op.iLike]: `%${search}%` } },
                    { apellidos: { [Op.iLike]: `%${search}%` } },
                ],
            }),
            ...(dni && { dni: { [Op.iLike]: `%${dni}%` } }),
            ...(state !== undefined && { state: parsedState }),
            ...(subgerencia && { id_subgerencia: subgerencia }),
            ...(turno && { id_turno: turno }),
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(jurisdiccion && { id_jurisdiccion: jurisdiccion }),
            ...(sexo && { id_sexo: sexo })
        };

        const empleados = await Empleado.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Turno, as: 'turno', attributes: ['nombre'] },
                { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] }
            ],
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        const descansos = await Descanso.findAll({
            where: {
                fecha: { [Op.between]: [inicio, fin] }
            },
            include: [{ model: Empleado, as: 'empleado', attributes: ['id'] }]
        });

        // Mapeo de los descansos por empleado y fecha :
        const descansoMap = {};
        descansos.forEach(descanso => {
            const { id, id_empleado, fecha, tipo } = descanso;
            if (!descansoMap[id_empleado]) descansoMap[id_empleado] = {};
            descansoMap[id_empleado][fecha] = { tipo, id };
        });

        const result = empleados.rows.map(empleado => ({
            id_empleado: empleado.id,
            nombres: empleado.nombres,
            apellidos: empleado.apellidos,
            dni: empleado.dni,
            cargo: empleado.cargo ? empleado.cargo.nombre : null,
            turno: empleado.turno ? empleado.turno.nombre : null,
            regimen: empleado.regimenLaboral ? empleado.regimenLaboral.nombre : null,
            descansos: dias.map(fecha => {
                const descanso = descansoMap[empleado.id]?.[fecha];
                return {
                    fecha,
                    tipo: descanso ? descanso.tipo : null,
                    id_descanso: descanso ? descanso.id : null
                };
            })
        }));

        return {
            data: result,
            currentPage: page,
            totalCount: empleados.count
        };

    } catch (error) {
        console.error('Error al obtener las asistencias de un rango de fechas:', error);
        return false;
    }
};

const createDescansos = async ({ fecha, tipo, observacion, id_empleado }) => {
    try {
        const response = await Descanso.create({ fecha, tipo, observacion, id_empleado });
        return response || null
    } catch (error) {
        console.error({ message: "Error en el controlador al crear el Descanso", data: error });
        return false
    }
};

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
    getDescansosRango,
    updateDescanso,
    createDescansos,
    deleteDescanso
}