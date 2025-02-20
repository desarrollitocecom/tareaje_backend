const { Asistencia, Empleado, Cargo, Turno, RegimenLaboral } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener la asistencia por ID (formato UUID) :
const getAsistenciaById = async (id) => {

    try {
        const asistencia = await Asistencia.findByPk(id);
        return asistencia || null;

    } catch (error) {
        console.error({
            message: 'Error al obtener la asistencia por ID: ',
            error: error.message
        });
        return false;
    }
};

// Obtener las asistencias (todos los estados) de un día determinado con filtros - ASISTENCIA DEL PERSONAL :
const getAsistenciaDiaria = async (page = 1, limit = 20, fecha, filters = {}) => {

    const { search, subgerencia, turno, cargo, regimen, lugar, sexo, dni, state, estado } = filters; // Extraer filtros
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            state: true,
            ...(search && {
                [Op.and]: search.split(' ').map((term) => ({
                    [Op.or]: [
                        { nombres: { [Op.iLike]: `%${term}%` } },
                        { apellidos: { [Op.iLike]: `%${term}%` } },
                    ],
                })),
            }),
            ...(dni && { dni: { [Op.iLike]: `%${dni}%` } }),
            ...(subgerencia && { id_subgerencia: subgerencia }),
            ...(turno && { id_turno: turno }),
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(lugar && { id_lugar_trabajo: lugar }),
            ...(sexo && { id_sexo: sexo })
        };

        const asistencias = await Asistencia.findAndCountAll({
            where: {
                fecha: fecha,
                ...(estado && { estado: estado })
            },
            include: [
                {
                    model: Empleado,
                    as: 'empleado',
                    attributes: ['nombres', 'apellidos', 'dni', 'foto'],
                    where: whereCondition,
                    include: [
                        { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                        { model: Turno, as: 'turno', attributes: ['nombre'] },
                        { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] }
                    ]
                }
            ],
            limit,
            offset,
            order: [['hora', 'ASC']]
        });

        return {
            data: asistencias.rows,
            currentPage: page,
            totalCount: asistencias.count
        };

    } catch (error) {
        console.error({
            message: 'Error al obtener las asistencias de un día determinado:',
            error: error.message
        });
        return false;
    }
};

// Obtener los IDs de asistencias con datos de empleado en un rango de fechas :
const getIdsAsistenciaRango = async (id_empleado, inicio, fin) => {

    try {
        const asistencias = await Asistencia.findAll({
            where: {
                fecha: { [Op.between]: [inicio, fin] },
                id_empleado: id_empleado
            },
            include: [{ model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos', 'dni'] }],
            order: [['fecha', 'ASC']]
        });
        if (!asistencias) return null;

        const nombre = asistencias[0].empleado.nombres;
        const apellido = asistencias[0].empleado.apellidos;
        const dni = asistencias[0].empleado.dni;

        const info = [];
        asistencias.forEach(a => {
            const id = a.id;
            const fecha = a.fecha;
            const estado = a.estado
            const carga = { id, fecha, estado };
            info.push(carga);
        });

        const result = { nombre, apellido, dni, info };
        return result;

    } catch (error) {
        console.error({
            message: 'Error al obtener las asistencias de un rango de fechas:',
            error: error.message
        });
        return false;
    }
};

// Obtener asistencias (todos los estados) en un rango de fechas con filtros - SEGUIMIENTO DEL PERSONAL :
const getAsistenciaRango = async (page = 1, limit = 20, inicio, fin, filters = {}) => {

    const { search, subgerencia, turno, cargo, regimen, lugar, sexo, dni, state } = filters;
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
            ...(dni && { dni: { [Op.iLike]: `%${dni}%` } }),
            ...(state !== undefined && { state: state }),
            ...(subgerencia && { id_subgerencia: subgerencia }),
            ...(turno && { id_turno: turno }),
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(lugar && { id_lugar_trabajo: lugar }),
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

        const asistencias = await Asistencia.findAll({
            where: {
                fecha: { [Op.between]: [inicio, fin] }
            },
            include: [{ model: Empleado, as: 'empleado', attributes: ['id'] }]
        });

        // Mapeo de las asistencias por empleado y fecha :
        const asistenciaMap = {};
        asistencias.forEach(asistencia => {
            const { id, id_empleado, fecha, estado } = asistencia;
            if (!asistenciaMap[id_empleado]) asistenciaMap[id_empleado] = {};
            asistenciaMap[id_empleado][fecha] = { estado, id };
        });

        const result = empleados.rows.map(empleado => ({
            id_empleado: empleado.id,
            nombres: empleado.nombres,
            apellidos: empleado.apellidos,
            dni: empleado.dni,
            cargo: empleado.cargo ? empleado.cargo.nombre : null,
            turno: empleado.turno ? empleado.turno.nombre : null,
            regimen: empleado.regimenLaboral ? empleado.regimenLaboral.nombre : null,
            estados: dias.map(fecha => {
                const asistencia = asistenciaMap[empleado.id]?.[fecha];
                return {
                    fecha,
                    asistencia: asistencia ? asistencia.estado : null,
                    id_asistencia: asistencia ? asistencia.id : null
                };
            })
        }));

        return {
            data: result,
            currentPage: page,
            totalCount: empleados.count
        };

    } catch (error) {
        console.error({
            message: 'Error al obtener las asistencias de un rango de fechas:',
            error: error.message
        });
        return false;
    }
};

// Obtener todas las asistencias :
const getAllAsistencias = async (page = 1, limit = 20) => {

    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        const response = await Asistencia.findAndCountAll({
            limit,
            offset,
            order: [['fecha', 'ASC']],
            raw: true
        });

        return {
            data: response.rows,
            currentPage: page,
            totalCount: response.count,
        };

    } catch (error) {
        console.error('Error al obtener todas los asistencias:', error);
        return false;
    }
};

// Validar si una asistencia ya existe para evitar duplicados
const validateAsistencia = async (fecha, id_empleado) => {
    
    try {
        const response = await Asistencia.findOne({
            where: { fecha: fecha, id_empleado: id_empleado }
        });
        return response || null; 

    } catch (error) {
        console.error({
            message: 'Error al validar la asistencia',
            error: error.message
        })
    }
};

// Crear asistencia para el algoritmo (SIN HANDLER) :
const createAsistencia = async (fecha, hora, estado, id_empleado, photo_id, evidencia = false) => {

    const errores = [];
    if (!fecha) errores.push('Es necesario que exista el parámetro FECHA');
    if (!hora) errores.push('Es necesario que exista el parámetro HORA');
    if (!id_empleado) errores.push('Es necesario que exista el parámetro ID EMPLEADO');
    if (!photo_id) errores.push('Es necesario que exista el parámetro PHOTO ID');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.push('El formato para la FECHA es incorrecto');
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(hora)) errores.push('El formato para la HORA es incorrecto');
    if (estado && !['A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF','T'].includes(estado)) errores.push('El estado ingresado no es el correspondiente');
    if (isNaN(id_empleado)) errores.push('El formato para el ID EMPLEADO debe ser un entero');

    if (errores.length > 0) {
        console.warn({
            message: 'Se encontraron los siguientes errores:',
            errores: errores
        });
        return false;
    }

    try {
        const response = await Asistencia.create({ fecha, hora, estado, id_empleado, photo_id, evidencia });
        if (!response) {
            console.warn('No se pudo crear la asistencia');
            return false;
        }
        return true;

    } catch (error) {
        console.error({
            message: 'Error al crear asistencia automática:',
            error: error.message
        });
        return false;
    }
};

// Crear asistencia, esto lo realizará un usuario (sin photo_id) :
const createAsistenciaUsuario = async (fecha, hora, estado, id_empleado) => {

    try {
        const response = await Asistencia.create({ fecha, hora, estado, id_empleado, photo_id: 'Asistencia manual' });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error al crear una asistencia manual:',
            error: error.message
        });
        return false;
    }
};

// Actualizar la asistencia para el algoritmo (SIN HANDLER) :
const updateAsistencia = async (id, fecha, hora, estado, id_empleado, photo_id, evidencia = false) => {
    
    try {
        const response = await Asistencia.findByPk(id);
        if (response) await response.update({ fecha, hora, estado, id_empleado, photo_id, evidencia});
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error al actualizar una asistencia automáticamente:',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getAsistenciaById,
    getAsistenciaDiaria,
    getAsistenciaRango,
    getIdsAsistenciaRango,
    getAllAsistencias,
    validateAsistencia,
    createAsistencia,
    createAsistenciaUsuario,
    updateAsistencia
};