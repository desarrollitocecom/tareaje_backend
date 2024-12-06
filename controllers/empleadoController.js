const { Empleado, Cargo, RegimenLaboral, Sexo,
    Jurisdiccion, GradoEstudios, LugarTrabajo, Subgerencia, Turno, Funcion } = require('../db_connection');
const { Op } = require('sequelize');

const { deletePerson } = require('./axxonController');

const getAllUniverseEmpleados = async () => {

    try {
        const response = await Empleado.findAndCountAll({
            where: { state: true },
            attributes: ['id', 'nombres', 'apellidos', 'dni'],
            order: [['apellidos', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows } || null;

    } catch (error) {
        console.error("Error al obtener todos los empleados:", error);
        return false;
    }
};

const getAllEmpleados = async (page = 1, limit = 20, filters = {}) => {
    const { search, dni, state, cargo, subgerencia, turno } = filters; // Extraer filtros
    const offset = (page - 1) * limit;
    const parsedState = state === "true";
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
            ...(dni && { dni: { [Op.iLike]: `%${dni}%` } }), // busca por dni que coincida con el filtro, puede ser el DNI completo o parte de él
            ...(state !== undefined && { state: parsedState }), // Búsqueda exacta por estado: true o false
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
            attributes: ['id', 'nombres', 'apellidos', 'dni', 'celular', 'state', 'foto'],
            include: includeConditions,
            limit,
            offset,
            order: [['id', 'ASC']]
        });

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
        const consulta = await deletePerson(response.dni);
        if (!consulta) return null;
        response.state = false;
        await response.save();
        return response || null;

    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Eliminar');
        return false;
    }

};
const updateEmpleado = async (
    id,
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
) => {

    try {
        const empleado = await getEmpleado(id);
        if (!empleado) return null;

        if (empleado) {
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
        }
        return empleado || null;
    } catch (error) {
        console.error("Error al modificar el empleado en el controlador:", error);
        return false;
    }
};
const getEmpleadoByDni = async (dni) => {

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
            }
        });

        if (!response) {
            console.warn('No se obtuvo los empleados para estos ids de función y turno...');
            return null;
        }
        const result = response.map(r => ({
            ...r.dataValues,
            state: false
        }));
        return result;

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
    findEmpleado,
    createEmpleado,
    deleteEmpleado,
    updateEmpleado
};