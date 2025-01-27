const { Descanso, Empleado, Cargo, Turno, RegimenLaboral } = require("../db_connection");
const { Op } = require('sequelize');

// Obtener un descanso por ID :
const getDescanso = async (id) => {
    try {
        const response = await Descanso.findOne({
            where: { id, state: true },
            include: [
                { model: Empleado, as: 'empleado', attributes: ['id', 'nombres', 'apellidos'] }
            ]
        })
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener un descanso por ID',
            data: error.message
        });
        return false;
    }
};

// Obtener todos los descansos con paginación :
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

        return {
            totalCount: response.count,
            data: response.rows,
            currentPage: page
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los descansos',
            error: error.message
        });
        return false
    }
};

// Obtener descansos (todos los tipos) en un rango de fechas con filtros :
const getDescansosRango = async (page = 1, limit = 20, inicio, fin, filters = {}) => {

    const { search, subgerencia, turno, cargo, regimen, lugar, sexo, dni, funcion } = filters;
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
                [Op.and]: search.split(' ').map((term) => ({
                    [Op.or]: [
                        { nombres: { [Op.iLike]: `%${term}%` } },
                        { apellidos: { [Op.iLike]: `%${term}%` } },
                    ],
                })),
            }),
            ...(dni && { dni: { [Op.iLike]: `%${dni}%` }}),
            ...(subgerencia && { id_subgerencia: subgerencia }),
            ...(turno && { id_turno: turno }),
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(lugar && { id_lugar_trabajo: lugar }),
            ...(sexo && { id_sexo: sexo }),
            ...(funcion && { id_funcion: funcion })
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
                state: true,
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
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener los descansos en un rango de fechas',
            error: error.message
        });
        return false;
    }
};

// Obtener todos los descansos de una fecha determinada :
const getDescansosDiario = async (fecha) => {
    
    try {
        const response = await Descanso.findAll({
            where: { state: true, fecha },
            attributes: ['tipo', 'id_empleado'],
            raw: true
        });
        return response || null;
        
    } catch (error) {
        console.error({
            message: 'Error al obtener todos los descansos de una fecha',
            error: error.message
        });
        return false;
    }
};

// Crear un descanso :
const createDescanso = async (fecha, tipo, observacion, id_empleado) => {
    try {
        const response = await Descanso.create({ fecha, tipo, observacion, id_empleado });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear un descanso',
            error: error.message
        });
        return false;
    }
};

// Actualizar un descanso :
const updateDescanso = async (id, fecha, observacion, id_empleado) => {
    try {
        const response = await getDescanso(id);
        if (response) await response.update({ fecha, observacion, id_empleado });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar un descanso',
            error: error.message
        });
        return false;
    }
};

// Eliminar un descanso :
const deleteDescanso = async (id) => {

    try {
        const response = await getDescanso(id);
        if (!response) return null;

        response.state = false;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar un descanso',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getAllDescansos,
    getDescanso,
    getDescansosRango,
    getDescansosDiario,
    updateDescanso,
    createDescanso,
    deleteDescanso
};