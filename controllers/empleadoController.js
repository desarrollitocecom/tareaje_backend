const axios = require('axios');
const { Op } = require('sequelize');
const { INCIDENCIAS_CREATE_URL }= process.env; // URL Registrar Serenos API Incidencias

const {
    createPago,
    updatePago
 } = require('../controllers/pagoController');

const {
    Empleado, Cargo, RegimenLaboral, Sexo, Jurisdiccion, GradoEstudios, LugarTrabajo, Subgerencia, Turno, Funcion, Area, Pago
} = require('../db_connection');

// Obtener toda la información de los empleados (SECTOR TAREAJE - PROVISIONAL SCRIPTS) :
const getAllUniverseEmpleados = async () => {

    try {
        const response = await Empleado.findAndCountAll({
            attributes: [
                'id', 'nombres', 'apellidos', 'dni',
                'ruc', 'hijos', 'edad', 'f_nacimiento', 'correo', 'domicilio',
                'celular', 'f_inicio', 'observaciones', 'foto', 'carrera', 'state',
                'id_cargo', 'id_turno', 'id_regimen_laboral', 'id_sexo',
                'id_grado_estudios', 'id_jurisdiccion', 'id_lugar_trabajo',
                'id_subgerencia', 'id_lugar_trabajo', 'id_funcion', 'id_area'
            ],
            order: [['dni', 'ASC']]
        });
        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error("Error al obtener todos los empleados:", error);
        return false;
    }
};

// Obtener toda la información, sin incluir datos privados, de los empleados (SECTOR TAREAJE) :
const getAllEmpleados = async (page = 1, limit = 20, filters = {}) => {

    const { search, dni, state, cargo, subgerencia, regimen, jurisdiccion, sexo, turno, area, edadMin, edadMax, hijosMin, hijosMax } = filters; // Extraer filtros
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    // Calcular fechas basadas en edad mínima y máxima :
    const today = new Date();
    const dateFromEdadMin = edadMax ? new Date(today.getFullYear() - edadMax - 1, today.getMonth(), today.getDate() + 1) : null; //
    const dateFromEdadMax = edadMin ? new Date(today.getFullYear() - edadMin, today.getMonth(), today.getDate()) : null;

    // Asegurarse de que dateFromEdadMin y dateFromEdadMax son fechas válidas :
    const validDateFromEdadMin = dateFromEdadMin instanceof Date && !isNaN(dateFromEdadMin);
    const validDateFromEdadMax = dateFromEdadMax instanceof Date && !isNaN(dateFromEdadMax);

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
            },
            {
                model: Area,
                as: 'area',
                attributes: ['nombre'],
                ...(area && { where: { id: area } })
            }
        ];

        const response = await Empleado.findAndCountAll({
            where: whereCondition,
            attributes: ['id', 'nombres', 'apellidos', 'dni', 'celular', 'state', 'foto', 'f_nacimiento', 'carrera'],
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });
        return {
            totalCount: response.count,
            data: response.rows,
            currentPage: page
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los empleados',
            data: error
        });
        return false;
    }
};

// Obtener toda la información, incluido datos privados de los empleados (SECTOR PAGOS) :
const getAllEmpleadosPagos = async (page = 1, limit = 20, filters = {}) => {

    const { search, dni, state, cargo, subgerencia, regimen, jurisdiccion, sexo, turno, area, edadMin, edadMax, hijosMin, hijosMax } = filters; // Extraer filtros
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    // Calcular fechas basadas en edad mínima y máxima :
    const today = new Date();
    const dateFromEdadMin = edadMax ? new Date(today.getFullYear() - edadMax - 1, today.getMonth(), today.getDate() + 1) : null; //
    const dateFromEdadMax = edadMin ? new Date(today.getFullYear() - edadMin, today.getMonth(), today.getDate()) : null;

    // Asegurarse de que dateFromEdadMin y dateFromEdadMax son fechas válidas :
    const validDateFromEdadMin = dateFromEdadMin instanceof Date && !isNaN(dateFromEdadMin);
    const validDateFromEdadMax = dateFromEdadMax instanceof Date && !isNaN(dateFromEdadMax);

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
            },
            {
                model: Area,
                as: 'area',
                attributes: ['nombre'],
                ...(area && { where: { id: area } })
            },
            {
                model: Pago,
                as: 'pago',
                attributes: ['carasDni', 'cci', 'certiAdulto', 'claveSol', 'suspension']
            }
        ];

        const response = await Empleado.findAndCountAll({
            where: whereCondition,
            attributes: ['id', 'nombres', 'apellidos', 'dni', 'celular', 'state', 'foto', 'f_nacimiento', 'carrera'],
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });
        
        return {
            totalCount: response.count,
            data: response.rows,
            currentPage: page
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los empleados para el sector de pagos',
            data: error
        });
        return false;
    }
};

// Obtener la información sin datos privados de un empleado (SECTOR TAREAJE) :
const getEmpleado = async (id) => {

    try {
        const response = await Empleado.findOne({
            attributes: ['id', 'nombres', 'apellidos', 'dni',
                'ruc', 'hijos', 'edad', 'f_nacimiento', 'correo', 'domicilio',
                'celular', 'f_inicio', 'observaciones', 'carrera', 'foto',],
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
                { model: Area, as: 'area', attributes: ['nombre'] }
            ]
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el empleado por ID',
            data: error
        });
        return false;
    }
};

// Obtener la información con datos privados de un empleado (SECTOR PAGOS) :
const getEmpleadoPago = async (id) => {

    try {
        const response = await Empleado.findOne({
            attributes: ['id', 'nombres', 'apellidos', 'dni',
                'ruc', 'hijos', 'edad', 'f_nacimiento', 'correo', 'domicilio',
                'celular', 'f_inicio', 'observaciones', 'carrera', 'foto'],
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
                { model: Area, as: 'area', attributes: ['nombre'] },
                { model: Pago, as: 'pago', attributes: ['carasDni', 'cci', 'certiAdulto', 'claveSol', 'suspension'] }
            ]
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el empleado por ID para el sector de pagos',
            data: error
        });
        return false;
    }
};

// Crear a un empleado con toda la información, asimismo registrarlo en DB de Incidencias (SECTOR TAREAJE Y PAGOS) :
const createEmpleado = async (
    nombres, apellidos, dni, ruc, hijos, edad,
    f_nacimiento, correo, domicilio, celular, f_inicio, foto, observaciones, carrera,
    id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
    id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area,
    carasDni, cci, certiAdulto, claveSol, suspension
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
            carrera,
            id_cargo,
            id_turno,
            id_regimen_laboral,
            id_sexo,
            id_jurisdiccion,
            id_grado_estudios,
            id_subgerencia,
            id_funcion,
            id_lugar_trabajo,
            id_area
        });
        if (!response) return null;

        const result = await createPago(carasDni, cci, certiAdulto, claveSol, suspension, response.id);
        if (!result) console.warn(`No se pudo crear la información de pagos para el empleado con DNI ${dni}`);

        /* const consulta = {
            "nombres": nombres,
            "apelllidoPaterno": apellidos.split(' ')[0],
            "apellidoMaterno": apellidos.split(' ')[1],
            "cargo_sereno_id": id_cargo,
            "dni": dni
        };

        try {
            const sereno = await axios.post(INCIDENCIAS_CREATE_URL, consulta);
            if (!sereno) console.warn(`No se pudo registrar en la DB de Incidencias para el empleado con DNI ${dni}`);
            
        } catch (error) {
            console.error({
                message: `Error al registrar en la DB de Incidencias al empleado con DNI ${dni}`,
                data: error
            });
        } */

        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear al empleado',
            data: error
        });
        return false;
    }
};

// Cambio del estado del empleado (ACTIVO - CESADO) :
const deleteEmpleado = async (id) => {

    try {
        const response = await Empleado.findByPk(id);
        if (!response) return 1;
        
        const info = response.state;
        response.state = !info;
        await response.save();
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar al empleado',
            data: error
        });
        return false;
    }
};

// Actualizar la información sin incluir datos privados del empleado (SECTOR TAREAJE) :
const updateEmpleado = async (
    id, nombres, apellidos, dni, ruc, hijos, edad,
    f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, carrera, foto,
    id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
    id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area
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
            carrera,
            foto,
            id_cargo,
            id_turno,
            id_regimen_laboral,
            id_sexo,
            id_jurisdiccion,
            id_grado_estudios,
            id_subgerencia,
            id_funcion,
            id_lugar_trabajo,
            id_area
        });
        return empleado || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar al empleado',
            data: error
        });
        return false;
    }
};

// Actualizar la información incluyendo datos privados del empleado (SECTOR PAGOS) :
const updateEmpleadoPago = async (
    id, nombres, apellidos, dni, ruc, hijos, edad,
    f_nacimiento, correo, domicilio, celular, f_inicio, observaciones, carrera, foto,
    id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
    id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area,
    carasDni, cci, certiAdulto, claveSol, suspension
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
            carrera,
            foto,
            id_cargo,
            id_turno,
            id_regimen_laboral,
            id_sexo,
            id_jurisdiccion,
            id_grado_estudios,
            id_subgerencia,
            id_funcion,
            id_lugar_trabajo,
            id_area
        });
        if (!empleado) return null;

        const result = await updatePago(carasDni, cci, certiAdulto, claveSol, suspension, id);
        if (!result) console.warn(`No se pudo actualizar la información de pagos para el empleado con DNI ${dni}`);
        return empleado;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar al empleado para el sector de pagos',
            data: error
        });
        return false;
    }
};

// Obtener información básica del empleado :
const getEmpleadoByDni = async (dni) => {

    try {
        const empleado = await Empleado.findOne({
            attributes: ['id','nombres','apellidos','foto'],
            where: { dni }
        });
        return empleado || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el empleado por DNI',
            data: error
        });
        return false;
    }
};

// Obtener el ID del empleado por medio del DNI del empleado :
const getEmpleadoIdByDni = async (dni) => {

    try {
        const empleado = await Empleado.findOne({
            attributes: ['id'],
            where: { dni }
        });
        return empleado || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el ID del empleado por DNI',
            data: error
        });
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
        console.error({
            message: 'Error en el controlador al obtener los empleado por funciones y turno',
            data: error
        });
        return false;
    }
};

// Obtener los empleados que sean del turno Rotativo o No Definido :
const rotativoEmpleado = async () => {
    
    try {
        const response = await Empleado.findAll({
            attributes: ['id','dni'],
            where: {
                state: true,
                id_turno: { [Op.in]: [4,5] }
            },
            raw: true
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener los empleados con turno No Definido y Rotativo',
            data: error
        });
        return false;
    }
};

module.exports = {
    getAllUniverseEmpleados,
    getEmpleadoByDni,
    getAllEmpleados,
    getAllEmpleadosPagos,
    getEmpleado,
    getEmpleadoPago,
    getEmpleadoByDni,
    getEmpleadoIdByDni,
    findEmpleado,
    rotativoEmpleado,
    createEmpleado,
    deleteEmpleado,
    updateEmpleado,
    updateEmpleadoPago
};