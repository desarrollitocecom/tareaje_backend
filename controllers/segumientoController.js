const { Asistencia, Descanso, Vacacion, Empleado, Cargo, Turno, RegimenLaboral } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener asistencias (todos los estados) en un rango de fechas con filtros :
const getSeguimiento = async (page = 1, limit = 20, inicio, fin, filters = {}) => {

    const { search, dni, cargo, turno, regimen, sexo, jurisdiccion, grado, subgerencia, lugar, funcion, area, state } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;
    const dias = [];

    // Obtener todos los días en una lista :
    let fechaDate = new Date(inicio);
    while (fechaDate <= new Date(fin)) {
        dias.push(new Date(fechaDate).toISOString().split('T')[0]);
        fechaDate.setDate(fechaDate.getDate() + 1);
    }

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            blacklist: false,
            ...(search && {
                [Op.and]: search.split(' ').map((term) => ({
                    [Op.or]: [
                        { nombres: { [Op.iLike]: `%${term}%` } },
                        { apellidos: { [Op.iLike]: `%${term}%` } },
                    ],
                })),
            }),
            ...(dni && { dni: { [Op.iLike]: `%${dni}%` } }),
            ...(turno && { id_turno: turno }),
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(sexo && { id_sexo: search }),
            ...(jurisdiccion && { id_jurisdiccion: jurisdiccion }),
            ...(grado && { id_grado_estudios: grado }),
            ...(subgerencia && { id_subgerencia: subgerencia }),
            ...(lugar && { id_lugar_trabajo: lugar }),
            ...(funcion && { id_funcion: funcion }),
            ...(area && { id_area: area }),
            ...(state !== undefined && { state }),
        };

        // Obtener todos los empleados :
        const empleados = await Empleado.findAll({
            where: whereCondition,
            include: [
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Turno, as: 'turno', attributes: ['nombre'] },
                { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] }
            ],
            limit,
            offset,
            order: [['apellidos', 'ASC']],
            raw: true
        });

        // Obtener todas las asistencias y descansos en una sola consulta:
        const [asistencias, descansos] = await Promise.all([
            Asistencia.findAll({
                where: {
                    fecha: { [Op.between]: [inicio, fin] }
                },
                include: [{ model: Empleado, as: 'empleado', attributes: ['id'] }],
                raw: true
            }),
            Descanso.findAll({
                where: {
                    state: true,
                    fecha: { [Op.between]: [inicio, fin] }
                },
                attributes: ['id', 'id_empleado', 'fecha', 'tipo'],
                order: [['fecha', 'ASC']],
                raw: true
            })
        ]);

        // Mapeo de las asistencias por empleado y fecha :
        const asistenciaMap = empleados.reduce((map, empleado) => {
            map[empleado.id] = asistencias.filter(asistencia => asistencia.id_empleado === empleado.id)
                .reduce((acc, asistencia) => {
                    acc[asistencia.fecha] = { estado: asistencia.estado, id: asistencia.id };
                    return acc;
                }, {});
            return map;
        }, {});

        // Mapeo de los descansos por empleado y fecha :
        const descansoMap = empleados.reduce((map, empleado) => {
            map[empleado.id] = descansos.filter(descanso => descanso.id_empleado === empleado.id)
                .reduce((acc, descanso) => {
                    acc[descanso.fecha] = { tipo: descanso.tipo, id: descanso.id };
                    return acc;
                }, {});
            return map;
        }, {});

        // Resultados finales con optimización :
        const result = empleados.map(empleado => ({
            id_empleado: empleado.id,
            nombres: empleado.nombres,
            apellidos: empleado.apellidos,
            dni: empleado.dni,
            cargo: empleado['cargo.nombre'],
            turno: empleado['turno.nombre'],
            regimen: empleado['regimenLaboral.nombre'],
            estados: dias.map(fecha => {
                
                const asistencia = asistenciaMap[empleado.id]?.[fecha];
                const descanso = descansoMap[empleado.id]?.[fecha];

                const dateFecha = new Date(fecha);
                const dateFin = new Date(empleado.f_fin);

                if (!empleado.state && dateFecha >= dateFin) return {
                    fecha,
                    model: null,
                    tipo: 'R',
                    id_modelo: null
                }

                if (asistencia && !descanso) return {
                    fecha,
                    model: 'Asistencia',
                    tipo: asistencia.estado,
                    id_modelo: asistencia.id
                };

                if (descanso) return {
                    fecha,
                    model: 'Descanso',
                    tipo: descanso.tipo,
                    id_modelo: descanso.id
                };

                return {
                    fecha,
                    model: null,
                    tipo: null,
                    id_modelo: null
                };
            })
        }));

        return {
            data: result,
            currentPage: page,
            totalCount: empleados.length
        };


    } catch (error) {
        console.error('Error al obtener las asistencias de un rango de fechas:', error);
        return false;
    }
};

module.exports = { getSeguimiento };