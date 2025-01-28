const axios = require('axios');
const { Op } = require('sequelize');
const { INCIDENCIAS_CREATE_URL, INCIDENCIAS_READ_URL }= process.env; // URLs API Incidencias
// const { decrypt } = require('../utils/security');

const {
    createPago,
    updatePago
 } = require('../controllers/pagoController');

const {
    Empleado, Cargo, RegimenLaboral, Sexo, Jurisdiccion, GradoEstudios, LugarTrabajo, Subgerencia, Turno, Funcion, Area, Pago
} = require('../db_connection');
const { response } = require('express');

// Obtener toda la información de los empleados (SECTOR TAREAJE - PROVISIONAL SCRIPTS) :
const getAllUniverseEmpleados = async () => {

    try {
        const response = await Empleado.findAndCountAll({
            where: { blacklist: false },
            order: [['dni', 'ASC']],
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

    const { search, dni, state, cargo, subgerencia, regimen, jurisdiccion, grado, lugar, sexo, turno, funcion, area, edadMin, edadMax, hijosMin, hijosMax } = filters; // Extraer filtros
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
            ...(state !== undefined && { state }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(jurisdiccion && { id_jurisdiccion: jurisdiccion }),
            ...(lugar && { id_lugar_trabajo: lugar }),
            ...(grado && { id_grado_estudios: grado }),
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
                model: Cargo, as: 'cargo', attributes: ['nombre'],
                ...(cargo && { where: { id: cargo } })
            },
            {
                model: Turno, as: 'turno', attributes: ['nombre'],
                ...(turno && { where: { id: turno } })
            },
            {
                model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'],
                ...(regimen && { where: { id: regimen } })
            },
            {
                model: Sexo, as: 'sexo', attributes: ['nombre'],
                ...(sexo && { where: { id: sexo } })
            },
            {
                model: Jurisdiccion, as: 'jurisdiccion', attributes: ['nombre'],
                ...(jurisdiccion && { where: { id: jurisdiccion } })
            },
            {
                model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'],
                ...(grado && { where: { id: grado } })
            },
            {
                model: Subgerencia, as: 'subgerencia', attributes: ['nombre'],
                ...(subgerencia && { where: { id: subgerencia } })
            },
            {
                model: LugarTrabajo, as: 'lugarTrabajo', attributes: ['nombre'],
                ...(lugar && { where: { id: lugar } })
            },
            {
                model: Funcion, as: 'funcion', attributes: ['nombre'],
                ...(funcion && { where: { id: funcion } })
            },
            {
                model: Area, as: 'area', attributes: ['nombre'],
                ...(area && { where: { id: area } })
            }
        ];

        const response = await Empleado.findAndCountAll({
            where: whereCondition,
            attributes: ['id', 'nombres', 'apellidos', 'dni', 'ruc', 'edad', 'f_nacimiento', 'correo', 'domicilio', 'celular',  'f_inicio', 'foto', 'observaciones', 'carrera', 'f_fin', 'state'],
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

    const { search, dni, state, cargo, subgerencia, regimen, jurisdiccion, grado, lugar, sexo, turno, funcion, area, edadMin, edadMax, hijosMin, hijosMax } = filters; // Extraer filtros
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
            ...(state !== undefined && { state }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(jurisdiccion && { id_jurisdiccion: jurisdiccion }),
            ...(lugar && { id_lugar_trabajo: lugar }),
            ...(grado && { id_grado_estudios: grado }),
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
                model: Cargo, as: 'cargo', attributes: ['nombre'],
                ...(cargo && { where: { id: cargo } })
            },
            {
                model: Turno, as: 'turno', attributes: ['nombre'],
                ...(turno && { where: { id: turno } })
            },
            {
                model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'],
                ...(regimen && { where: { id: regimen } })
            },
            {
                model: Sexo, as: 'sexo', attributes: ['nombre'],
                ...(sexo && { where: { id: sexo } })
            },
            {
                model: Jurisdiccion, as: 'jurisdiccion', attributes: ['nombre'],
                ...(jurisdiccion && { where: { id: jurisdiccion } })
            },
            {
                model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'],
                ...(grado && { where: { id: grado } })
            },
            {
                model: Subgerencia, as: 'subgerencia', attributes: ['nombre'],
                ...(subgerencia && { where: { id: subgerencia } })
            },
            {
                model: LugarTrabajo, as: 'lugarTrabajo', attributes: ['nombre'],
                ...(lugar && { where: { id: lugar } })
            },
            {
                model: Funcion, as: 'funcion', attributes: ['nombre'],
                ...(funcion && { where: { id: funcion } })
            },
            {
                model: Area, as: 'area', attributes: ['nombre'],
                ...(area && { where: { id: area } })
            },
            {
                model: Pago, as: 'pago', attributes: ['carasDni', 'cci', 'certiAdulto', 'claveSol', 'suspension']
            }
        ];

        const response = await Empleado.findAndCountAll({
            where: whereCondition,
            attributes: ['id', 'nombres', 'apellidos', 'dni', 'ruc', 'edad', 'f_nacimiento', 'correo', 'domicilio', 'celular',  'f_inicio', 'foto', 'observaciones', 'carrera', 'f_fin', 'state'],
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
            where: { id, blacklist: false },
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
            where: { id, blacklist: false },
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
        /* response.pago.cci = decrypt(response.pago.cci);
        response.pago.certiAdulto = decrypt(response.pago.certiAdulto);
        response.pago.claveSol = decrypt(response.pago.claveSol);
        response.pago.suspension = decrypt(response.pago.suspension); */
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

        if (Number(id_subgerencia) !== 1) return response;

        // Los IDs de cargo de ambas tablas no coinciden por lo que se hace lo siguiente :
        const ids_cargos = { 1: 32, 2: 1, 3: 33, 4: 34, 6: 36, 11: 2, 13: 41, 17: 45, 19: 11, 72: 54 };
        const id_cargo_incidencias = ids_cargos[Number(id_cargo)];
        if (!id_cargo_incidencias) return response;

        const consulta = {
            "nombres": nombres,
            "apellidoPaterno": apellidos.split(' ')[0],
            "apellidoMaterno": apellidos.split(' ')[1],
            "cargo_sereno_id": id_cargo_incidencias,
            "dni": dni
        };

        try {
            const sereno = await axios.post(INCIDENCIAS_CREATE_URL, consulta);
            if (!sereno) console.warn(`No se pudo registrar en la DB de Incidencias para el empleado con DNI ${dni}`);
            else console.log(`Sereno con DNI ${dni} registrado exitosamente en la DB de Incidencias`);
            
        } catch (error) {
            console.error({
                message: `Error al registrar en la DB de Incidencias al empleado con DNI ${dni}`,
                data: error
            });
        }

        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear al empleado',
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
        const response = await Empleado.findByPk(id);
        await response.update({
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
        
        if (!response) return null;

        if (Number(id_subgerencia) !== 1) return response;

        // Los IDs de cargo de ambas tablas no coinciden por lo que se hace lo siguiente :
        const ids_cargos = { 1: 32, 2: 1, 3: 33, 4: 34, 6: 36, 11: 2, 13: 41, 17: 45, 19: 11, 72: 54 };
        const id_cargo_incidencias = ids_cargos[Number(id_cargo)];
        if (!id_cargo_incidencias) return response;

        const serenos = await getAllSerenos();
        if (!serenos) {
            console.warn('No se obtuvieron los serenos de la DB de Incidencias...');
            return response;
        }

        const dato = serenos.find(sereno => sereno.dni === dni);
        if (dato) return response;

        const consulta = {
            "nombres": nombres,
            "apellidoPaterno": apellidos.split(' ')[0],
            "apellidoMaterno": apellidos.split(' ')[1],
            "cargo_sereno_id": id_cargo_incidencias,
            "dni": dni
        };

        try {
            const sereno = await axios.post(INCIDENCIAS_CREATE_URL, consulta);
            if (!sereno) console.warn(`No se pudo registrar en la DB de Incidencias para el empleado con DNI ${dni}`);
            else console.log(`Sereno con DNI ${dni} registrado exitosamente en la DB de Incidencias`);
            
        } catch (error) {
            console.error({
                message: `Error al registrar en la DB de Incidencias al empleado con DNI ${dni}`,
                data: error
            });
        }

        return response;

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
        const response = await Empleado.findByPk(id);
        await response.update({
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

        if (!response) return null;

        const result = await updatePago(carasDni, cci, certiAdulto, claveSol, suspension, id);
        if (!result) console.warn(`No se pudo actualizar la información de pagos para el empleado con DNI ${dni}`);

        if (!response) return null;

        if (Number(id_subgerencia) !== 1) return response;

        // Los IDs de cargo de ambas tablas no coinciden por lo que se hace lo siguiente :
        const ids_cargos = { 1: 32, 2: 1, 3: 33, 4: 34, 6: 36, 11: 2, 13: 41, 17: 45, 19: 11, 72: 54 };
        const id_cargo_incidencias = ids_cargos[Number(id_cargo)];
        if (!id_cargo_incidencias) return response;

        const serenos = await getAllSerenos();
        if (!serenos) {
            console.warn('No se obtuvieron los serenos de la DB de Incidencias...');
            return response;
        }

        const dato = serenos.find(sereno => sereno.dni === dni);
        if (dato) return response;

        const consulta = {
            "nombres": nombres,
            "apellidoPaterno": apellidos.split(' ')[0],
            "apellidoMaterno": apellidos.split(' ')[1],
            "cargo_sereno_id": id_cargo_incidencias,
            "dni": dni
        };

        try {
            const sereno = await axios.post(INCIDENCIAS_CREATE_URL, consulta);
            if (!sereno) console.warn(`No se pudo registrar en la DB de Incidencias para el empleado con DNI ${dni}`);
            else console.log(`Sereno con DNI ${dni} registrado exitosamente en la DB de Incidencias`);
            
        } catch (error) {
            console.error({
                message: `Error al registrar en la DB de Incidencias al empleado con DNI ${dni}`,
                data: error
            });
        }

        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar al empleado para el sector de pagos',
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

        const ahora = new Date();
        const peruOffset = -5 * 60; // offset de Perú en minutos
        const localOffset = ahora.getTimezoneOffset(); 
        const dia = new Date(ahora.getTime() + (peruOffset - localOffset) * 60000);
        const fin = dia.toISOString().split('T')[0];
        const estado = response.state;
        const fecha = (estado) ? fin : null;
        response.state = !estado;
        response.f_fin = fecha;
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

// Cambio del estado definitivo a false del empleado (SIN RETORNO) :
const deleteEmpleadoBlackList = async (id, f_fin) => {
    
    try {
        const response = await Empleado.findByPk(id);
        if (!response) return null;
        response.state = false;
        response.blacklist = true;
        response.f_fin = f_fin;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al eliminar al empleado definitivamente',
            data: error
        });
        return false;
    }  
};

// Obtener información básica del empleado :
const getEmpleadoByDni = async (dni) => {

    try {
        const response = await Empleado.findOne({
            where: { dni },
            attributes: ['id','nombres','apellidos','foto'],
            include: [{ model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] }],
        });
        return response || null;

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
        const response = await Empleado.findOne({
            where: { dni, blacklist: false, state: true },
            attributes: ['id'],
            raw: true
        });
        if (response.length === 0) return null;
        return response.id;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el ID del empleado por DNI',
            data: error
        });
        return false;
    }
};

// Obtención del empleado (id, dni, id_funcion, id_turno) para el algoritmo de asistencia :
const findEmpleado = async (ids_subgerencia, id_turno, ids_area) => {

    try {
        const response = await Empleado.findAll({
            attributes: ['id', 'dni'],
            where: {
                state: true,
                id_subgerencia: { [Op.in]: ids_subgerencia },
                id_turno: id_turno,
                id_area: { [Op.in]: ids_area }
            },
            raw: true
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener los empleado por subgerencia, turno y área',
            error: error.message
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

// Cambio del estado del empleado (ACTIVO - CESADO) :
const fechaEmpleado = async (id, fecha) => {

    try {
        const response = await Empleado.findByPk(id);
        response.f_nacimiento = fecha;
        await response.save();
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar fecha',
            data: error
        });
        return false;
    }
};

// Obtener a todos los serenos registrados en la DB de Incidencias (NO TIENE HANDLER) :
const getAllSerenos = async () => {
    
    try {
        const response = await axios.get(INCIDENCIAS_READ_URL);
        if (!response) return null;
        return response.data.data;

    } catch (error) {
        console.error({
            message: 'Error al obtener a los serenos de la DB de Incidencias',
            error: error.message
        });
        return false;
    }
};

const getEmpleadoById = async (id) => {
    
    try {
        const response = await Empleado.findByPk(id);
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error al obtener un empleado por ID',
            error: error.message
        });
        return false;
    }
};

// Obtener atributos específicos de un empleado por ID (Identidad SJL) :
const getEmpleadoByIdAttributes = async (id) => {
    
    try {
        const response = await Empleado.findOne({
            where: { id, blacklist: false },
            include: [
                { model: Turno, as: 'turno', attributes: ['nombre'] },
                { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
                { model: Area, as: 'area', attributes: ['nombre'] },
            ],
            raw: true
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener un empleado por ID con atributos específicos',
            error: error.message
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
    deleteEmpleadoBlackList,
    updateEmpleado,
    updateEmpleadoPago,
    fechaEmpleado,
    getEmpleadoById,
    getEmpleadoByIdAttributes
};