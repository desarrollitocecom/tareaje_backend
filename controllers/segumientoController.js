const { Asistencia, Cargo,  Empleado, Justificacion, RegimenLaboral, Turno } = require('../db_connection');
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

    const dateYear = fechaDate.getFullYear();
    const dateMonth = fechaDate.getMonth();
    const dateComparate = new Date(dateYear, dateMonth, 1);
    const dateMin = dateComparate.toISOString().split('T')[0];

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            f_fin: { 
                [Op.or]: [
                    { [Op.gte]: dateMin },
                    { [Op.is]: null }
                ]
            },
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

        const empleados = await Empleado.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Turno, as: 'turno', attributes: ['nombre'] },
                { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] },
                {
                    model: Asistencia,
                    as: 'asistencias',
                    attributes: ['id', 'fecha', 'estado', 'evidencia'],
                    required: false,
                    where: {
                        fecha: { [Op.between]: [inicio, fin] }
                    },
                    include: [
                        {
                            model: Justificacion,
                            as: 'justificaciones',
                            attributes: ['id', 'documentos', 'descripcion', 'f_inicio', 'f_fin'],
                            required: false,
                            where: { state: true },
                            through: { attributes: [] }
                        }
                    ]
                }
            ],
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });
        
        // Transformar el resultado para estructurar asistencias por fecha :
        const result = empleados.rows.map(empleado => {
            const asistenciaMap = empleado.asistencias.reduce((acc, asistencia) => {
                acc[asistencia.fecha] = {
                    estado: asistencia.estado,
                    id: asistencia.id,
                    evidencia: asistencia.evidencia,
                    exist: asistencia.justificaciones.length > 0,
                    id_justificacion: asistencia.justificaciones.length > 0 ? asistencia.justificaciones[0].id : null,
                    documentos: asistencia.justificaciones.length > 0 ? asistencia.justificaciones[0].documentos : null,
                    descripcion: asistencia.justificaciones.length > 0 ? asistencia.justificaciones[0].descripcion : null,
                    f_inicio: asistencia.justificaciones.length > 0 ? asistencia.justificaciones[0].f_inicio : null,
                    f_fin: asistencia.justificaciones.length > 0 ? asistencia.justificaciones[0].descripcion : null
                };
                return acc;
            }, {});
        
            return {
                id_empleado: empleado.id,
                nombres: empleado.nombres,
                apellidos: empleado.apellidos,
                dni: empleado.dni,
                cargo: empleado.cargo?.nombre || null,
                turno: empleado.turno?.nombre || null,
                regimen: empleado.regimenLaboral?.nombre || null,
                estados: dias.map(fecha => ({
                    fecha,
                    tipo: asistenciaMap[fecha]?.estado || null,
                    id_asistencia: asistenciaMap[fecha]?.id || null,
                    evidencia: asistenciaMap[fecha]?.evidencia ?? false,
                    justificacion: {
                        exist: asistenciaMap[fecha]?.exist || null,
                        id_justificacion: asistenciaMap[fecha]?.id_justificacion || null,
                        documentos: asistenciaMap[fecha]?.documentos || null,
                        descripcion: asistenciaMap[fecha]?.descripcion || null,
                        f_inicio: asistenciaMap[fecha]?.f_inicio || null,
                        f_fin: asistenciaMap[fecha]?.f_fin || null,
                    }
                }))
            };
        });
        
        return {
            data: result,
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

module.exports = { getSeguimiento };