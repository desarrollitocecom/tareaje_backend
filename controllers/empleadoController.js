const { Empleado, Cargo, RegimenLaboral, Sexo,
    Jurisdiccion, GradoEstudios, LugarTrabajo, Subgerencia, Turno, Funcion } = require('../db_connection');
const { Op } = require('sequelize');

const getAllUniverseEmpleados = async () => {

    try {
        const response = await Empleado.findAndCountAll({
            attributes: [
                'id', 'nombres', 'apellidos', 'dni',
                'ruc', 'hijos', 'edad', 'f_nacimiento', 'correo', 'domicilio',
                'celular', 'f_inicio', 'observaciones', 'foto', 'state',
                'id_cargo', 'id_turno', 'id_regimen_laboral', 'id_sexo',
                'id_grado_estudios', 'id_jurisdiccion', 'id_lugar_trabajo',
                'id_subgerencia', 'id_lugar_trabajo', 'id_funcion'
            ],
            order: [['dni', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows } || null;

    } catch (error) {
        console.error("Error al obtener todos los empleados:", error);
        return false;
    }
};

const getAllEmpleados = async (page = 1, limit = 20, filters = {}) => {
    const { search, dni, state, cargo, subgerencia, regimen, jurisdiccion, sexo, turno, edadMin, edadMax, hijosMin, hijosMax } = filters; // Extraer filtros
    const offset = (page - 1) * limit;
    limit = page == 0 ? null : limit;

    //const parsedState = state === "true";
    // Calcular fechas basadas en edad mínima y máxima
    const today = new Date();
    const dateFromEdadMin = edadMax ? new Date(today.getFullYear() - edadMax - 1, today.getMonth(), today.getDate() + 1) : null; //
    const dateFromEdadMax = edadMin ? new Date(today.getFullYear() - edadMin, today.getMonth(), today.getDate()) : null;

    // Asegurarse de que dateFromEdadMin y dateFromEdadMax son fechas válidas
    const validDateFromEdadMin = dateFromEdadMin instanceof Date && !isNaN(dateFromEdadMin);
    const validDateFromEdadMax = dateFromEdadMax instanceof Date && !isNaN(dateFromEdadMax);

    //console.log("EDAD: ", dateFromEdadMax, dateFromEdadMin);

    //console.log(search, dni, state, cargo, subgerencia, turno);
    try {
        // Construcción dinámica de condiciones
        const whereCondition = {
            ...(search && {
                [Op.or]: [
                    { nombres: { [Op.iLike]: `%${search}%` } },
                    { apellidos: { [Op.iLike]: `%${search}%` } },
                ],
            }),
            ...(dni && { dni: { [Op.iLike]: `%${dni}%` } }),
            ...(state !== undefined && { state }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(jurisdiccion && { id_jurisdiccion: jurisdiccion }),
            ...(sexo && { id_sexo: sexo }),
            ...(validDateFromEdadMin && validDateFromEdadMax && {
                f_nacimiento: {
                    [Op.between]: [dateFromEdadMin, dateFromEdadMax],
                },
            }),
            ...(hijosMin && hijosMax && {
                hijos: {
                    [Op.between]: [hijosMin, hijosMax]
                }
            })
        };


        const includeConditions = [
            {
                model: Cargo,
                as: 'cargo',
                attributes: ['nombre'],
                ...(cargo && { where: { id: cargo } })
            },
            {
                model: Subgerencia,
                as: 'subgerencia',
                attributes: ['nombre'],
                ...(subgerencia && { where: { id: subgerencia } })
            },
            {
                model: Turno,
                as: 'turno',
                attributes: ['nombre'],
                ...(turno && { where: { id: turno } })
            }
        ];

        const response = await Empleado.findAndCountAll({
            where: whereCondition,
            attributes: ['id', 'nombres', 'apellidos', 'dni', 'celular', 'state', 'foto', 'f_nacimiento'],
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });
        console.log("personas: ", response.count);
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error("Error al obtener todos los empleados:", error);
        return false;
    }
};

const getEmpleado = async (id) => {
    try {
        const response = await Empleado.findOne({
            attributes: ['id', 'nombres', 'apellidos', 'dni',
                'ruc', 'hijos', 'edad', 'f_nacimiento', 'correo', 'domicilio',
                'celular', 'f_inicio', 'observaciones', 'foto'],
            where: { id },
            include: [
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Turno, as: 'turno', attributes: ['nombre'] },
                { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] },
                { model: Sexo, as: 'sexo', attributes: ['nombre'] },
                { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
                { model: Jurisdiccion, as: 'jurisdiccion', attributes: ['nombre'] },
                { model: LugarTrabajo, as: 'lugarTrabajo', attributes: ['nombre'] },
                { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
                { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
                { model: Funcion, as: 'funcion', attributes: ['nombre'] },
            ]

        });
        return response || null
    } catch (error) {
        console.error("Error al obtener un empleado en el controlador:", error);
        return false;
    }
}

const createEmpleado = async (
    nombres, apellidos, dni, ruc, hijos, edad,
    f_nacimiento, correo, domicilio, celular, f_inicio, foto, observaciones,
    id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
    id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
) => {

    try {
        const response = await Empleado.create({
            nombres,
            apellidos,
            dni,
            ruc,
            hijos,
            edad,
            f_nacimiento,
            correo,
            domicilio,
            celular,
            f_inicio,
            foto,
            observaciones,
            id_cargo,
            id_turno,
            id_regimen_laboral,
            id_sexo,
            id_jurisdiccion,
            id_grado_estudios,
            id_subgerencia,
            id_funcion,
            id_lugar_trabajo
        });
        return response || null;
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        return false;
    }
};

const deleteEmpleado = async (id) => {

    try {
        const response = await Empleado.findByPk(id);
        if (!response) return 1;
        
        const info = response.state;
        response.state = !info;
        await response.save();
        return response || null;

    } catch (error) {
        console.error('Error al cambiar de estado...');
        return false;
    }

};
const updateEmpleado = async (
    id, nombres, apellidos, dni, ruc, hijos, edad,
    f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, foto,
    id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
    id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
) => {

    try {
        const empleado = await Empleado.findByPk(id);
        if (!empleado) return 1;

        await empleado.update({
            nombres,
            apellidos,
            dni,
            ruc,
            hijos,
            edad,
            f_nacimiento,
            correo,
            domicilio,
            celular,
            f_inicio,
            observaciones,
            foto,
            id_cargo,
            id_turno,
            id_regimen_laboral,
            id_sexo,
            id_jurisdiccion,
            id_grado_estudios,
            id_subgerencia,
            id_funcion,
            id_lugar_trabajo
        });
        return empleado || null;

    } catch (error) {
        console.error("Error al modificar el empleado en el controlador:", error);
        return false;
    }
};

const getEmpleadoByDni = async (dni) => {

    try {
        const empleado = await Empleado.findOne({
            attributes: ['nombres','apellidos','foto'],
            where: { dni }
        });
        return empleado || null;

    } catch (error) {
        console.error("Error al buscar el empleado por DNI:", error);
        return false;
    }
};
const getEmpleadoIdByDni = async (dni) => {

    try {
        const empleado = await Empleado.findOne({
            attributes: ['id'],
            where: { dni }
        });
        return empleado || null;

    } catch (error) {
        console.error("Error al buscar el empleado por DNI:", error);
        return false;
    }
};

// Obtención del empleado (id, dni, id_funcion, id_turno) para el algoritmo de asistencia :
const findEmpleado = async (ids_funcion, id_turno) => {

    try {
        const response = await Empleado.findAll({
            attributes: ['id', 'dni', 'id_funcion', 'id_turno'],
            where: {
                state: true,
                id_funcion: { [Op.in]: ids_funcion },
                id_turno: id_turno
            },
            raw: true
        });
        return response || null;

    } catch (error) {
        console.error('Error al obtener los empleados por función y turno:', error);
        return false;
    }
};

module.exports = {
    getAllUniverseEmpleados,
    getEmpleadoByDni,
    getAllEmpleados,
    getEmpleado,
    getEmpleadoByDni,
    getEmpleadoIdByDni,
    findEmpleado,
    createEmpleado,
    deleteEmpleado,
    updateEmpleado
};