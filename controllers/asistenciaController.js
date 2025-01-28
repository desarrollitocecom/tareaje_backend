const { Asistencia, Empleado, Cargo, Turno, RegimenLaboral } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener la asistencias por ID (formato UUID) :
const getAsistenciaById = async (id) => {

    try {
        const asistencia = await Asistencia.findByPk(id);
        return asistencia || null;
    } catch (error) {
        console.error('Error al obtener la asistencia por ID: ', error);
        return false;
    }
};

// Obtener las asistencias (todos los estados) de un día determinado con filtros :
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
        console.error('Error al obtener las asistencias de un día determinado:', error);
        return false;
    }
};

// Obtener ids asistencias con datos de empleado en un rango de fechas :
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
        console.error('Error al obtener las asistencias de un rango de fechas:', error);
        return false;
    }
};

// Obtener asistencias (todos los estados) en un rango de fechas con filtros :
const getAsistenciaRango = async (page = 1, limit = 20, inicio, fin, filters = {}) => {

    const { search, subgerencia, turno, cargo, regimen, lugar, sexo, dni, state } = filters; // Extraer filtros
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
        console.error('Error al obtener las asistencias de un rango de fechas:', error);
        return false;
    }
};

// Obtener todas las asistencias :
const getAllAsistencias = async (page = 1, pageSize = 20) => {

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    try {
        const response = await Asistencia.findAndCountAll({
            limit,
            offset,
            order: [['fecha', 'ASC']]
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

// Crear Asistencia desde el algoritmo (SIN HANDLER) :
const createAsistencia = async (fecha, hora, estado, id_empleado, photo_id) => {

    // Validaciones para crear de forma correcta la asistencia correspondiente :
    if (!fecha) {
        console.error('Es necesario que exista el parámetro FECHA');
        return false;
    }
    if (!hora) {
        console.error('Es necesario que exista el parámetro HORA');
        return false;
    }
    if (!estado) {
        console.error('Es necesario que exista el parámetro ESTADO');
        return false;
    }
    if (!id_empleado) {
        console.error('Es necesario que exista el parámetro ID EMPLEADO');
        return false;
    }
    if (!photo_id) {
        console.error('Es necesario que exista el parámetro PHOTO ID');
        return false;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        console.error('El formato para la FECHA es incorrecto');
        return false;
    }
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(hora)) {
        console.error('El formato para la HORA es incorrecto');
        return false;
    }
    if (!['A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF'].includes(estado)) {
        console.error('El estado ingresado no es el correspondiente');
        return false;
    }
    if (isNaN(id_empleado)) {
        console.error('El formato para el ID EMPLEADO debe ser un entero');
        return false;
    }

    try {
        const result = await Asistencia.findOne({
            where: { fecha: fecha, id_empleado: id_empleado },
            raw: true
        });
        if (result) return 1;

        const response = await Asistencia.create({
            fecha: fecha,
            hora: hora,
            estado: estado,
            id_empleado: id_empleado,
            photo_id: photo_id
        });
        if (!response) {
            console.warn('Resultado nulo: No se pudo crear la asistencia');
            return false;
        }
        return true;

    } catch (error) {
        console.error('Error al crear una nueva asistencia:', error);
        return false;
    }
};

// Crear asistencia, esto lo realizará un usuario (sin photo_id) :
const createAsistenciaUsuario = async (fecha, hora, estado, id_empleado) => {

    try {
        const asistencias = await Asistencia.findAndCountAll({
            where: {
                fecha: fecha,
                hora: hora,
                id_empleado: id_empleado
            }
        })
        if (asistencias.rows.length) return 1;

        const newAsistencia = await Asistencia.create({
            fecha: fecha,
            hora: hora,
            estado: estado,
            id_empleado: id_empleado,
            photo_id: "Asistencia manual"
        });
        return newAsistencia || null;

    } catch (error) {
        console.error('Error al crear una nueva asistencia:', error);
        return false;
    }
};

// Actualizar la asistencia :
// >> Dirigirse al controlador de Justificaciones: createJustificacion

// PROVISIONAL, SOLO PARA LA PRESENTACIÓN :
const updateAsistencia = async (fecha, hora, estado, photo_id, id_empleado) => {
    
    try {
        const asistencia = await Asistencia.findOne({
            where: {
                fecha: fecha,
                id_empleado: id_empleado
            }
        });

        if (!asistencia || asistencia.length === 0) return null;
        await asistencia.update({
            hora: hora,
            estado: estado,
            photo_id: photo_id
        });
        return asistencia;

    } catch (error) {
        console.log('Error al actualizar la asistencia:', error);
        return false;
    }
};

// Modificar el estado de una asistencia :
const updateEstadoAsistencia = async (id, estado) => {
    
    try {
        const response = await Asistencia.findByPk(id);
        if (response) await response.update({ estado });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar el estado de la asistencia',
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
    createAsistencia,
    createAsistenciaUsuario,
    updateAsistencia,
    updateEstadoAsistencia
};