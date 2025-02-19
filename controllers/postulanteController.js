const { Postulante, Distrito, Entidad, Convocatoria, Cargo, Sexo, GradoEstudios, Subgerencia } = require('../db_connection');
const { Op } = require('sequelize');

// ---------------------------------------------------------------------------------------------------------------------------------- //
// -------------------------------------------------  INFORMACIÓN DE UN POSTULANTE  ------------------------------------------------- //
// ---------------------------------------------------------------------------------------------------------------------------------- //

// Obtener la información del postulante :
const getPostulante = async (id) => {

    try {
        const response = await Postulante.findOne({
            where: { id, state: true },
            include: [
                { model: Distrito, as: 'distrito', attributes: ['nombre'] },
                { model: Entidad, as: 'entidad', attributes: ['nombre'] },
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Sexo, as: 'sexo', attributes: ['nombre'] },
                { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
                { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
                { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
            ]
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el postulante por ID',
            data: error
        });
        return false;
    }
};

// Obtener el postulante por ID :
const getPostulanteById = async (id) => {
    
    try {
        const response = await Postulante.findByPk(id);
        return response || null;
        
    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener el postulante por ID sin detalles',
            data: error
        });
        return false;
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------- //
// -----------------------------------------  MÓDULOS DE POSTULANTES - CONVOCATORIA ACTUAL  ----------------------------------------- //
// ---------------------------------------------------------------------------------------------------------------------------------- //

// < 01 > - Obtener todos los postulantes de la convocatoria actual con paginación, búsqueda y filtros :
const getPostulantesActual = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo })
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes de la convocatoria actual',
            data: error
        });
        return false;
    }
};

// < 02 > - Obtener todos los postulantes de la Black List de la convocatoria actual con paginación, búsqueda y filtros :
const getBlackListActual = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
            state_blacklist: true,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo })
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes de la Black List de la convocatoria actual',
            data: error
        });
        return false;
    }
};

// < 03 > - Obtener todos los postulantes que puedan rendir la prueba psicológica con paginación, búsqueda y filtros :
const getPsicologiaActual = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
            state_blacklist: false,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo })
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes que pueden rendir la prueba psicológica',
            data: error
        });
        return false;
    }
};

// < 04 > - Cambiar el estado de a prueba psicológica luego de haber rendido :
const asistenciaPsicologiaActual = async (id) => {
    
    try {
        const response = await Postulante.findByPk(id);
        if (!response) return null;
        response.prueba_psicologia = true;
        response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al tomar asistencia previo a la prueba física',
            data: error
        });
        return false;
    }
};

// < 05 > - Obtener todos los postulantes que hayan rendido la prueba de psicología para su posterior revisión :
const getPsicologiaRevisionActual = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
            state_blacklist: false,
            prueba_psicologica: true,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo })
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes que hayan rendido la prueba psicológica',
            data: error
        });
        return false;
    }
};

// < 06 > - Evaluar si la persona está apta o no apta luego de la prueba física :
const evaluatePsicologiaActual = async (id, estado) => {
    
    try {
        const response = await Postulante.findByPk(id);
        if (!response) return null;
        response.state_psicologia = estado;
        response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al evaluar al postulante luego de la prueba psicológicq',
            data: error
        });
        return false;
    }
};

// < 07 > - Obtener todos los postulantes que puedan rendir la prueba física con paginación, búsqueda y filtros :
const getFisicaActual = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
            state_blacklist: false,
            prueba_psicologica: true,
            state_psicologica: true,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo })
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes que puedan rendir la prueba física',
            data: error
        });
        return false;
    }
};

// < 08 > - Tomar asistencia previo a la prueba física :
const asistenciaFisicaActual = async (id, estado) => {
    
    try {
        const response = await Postulante.findByPk(id);
        if (!response) return null;
        response.prueba_fisica = estado;
        response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al tomar asistencia previo a la prueba física',
            data: error
        });
        return false;
    }
};

// < 09 > - Obtener todos los postulantes que hayan asistido a la prueba física para su posterior aceptación con paginación, búsqueda y filtros :
const getFisicaRevisionActual = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
            state_blacklist: false,
            prueba_psicologica: true,
            state_psicologica: true,
            prueba_fisica: true,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo })
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes que hayan asistido a la prueba física',
            data: error
        });
        return false;
    }
};

// < 10 > - Evaluar si la persona está apta o no apta luego de la prueba física :
const evaluateFisicaActual = async (id, estado) => {
    
    try {
        const response = await Postulante.findByPk(id);
        if (!response) return null;
        response.state_fisica = estado;
        response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al evaluar al postulante luego de la prueba física',
            data: error
        });
        return false;
    }
};

// < 11 > - Obtener todos los postulantes que puedan rendir la entrevista con paginación, búsqueda y filtros :
const getEntrevistaActual = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
            state_blacklist: false,
            prueba_psicologica: true,
            state_psicologica: true,
            prueba_fisica: true,
            state_fisica: true,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo })
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes',
            data: error
        });
        return false;
    }
};

// < 12 > - Determinar si el postulante está apto para iniciar a laborar :
const acceptPostulanteActual = async (id, estado) => {
    
    try {
        const response = await Postulante.findByPk(id);
        if (!response) return null;
        response.state_accept = estado;
        response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al determinar si el postulante está apto',
            data: error
        });
        return false;
    }
};

// < 13 > - Actualizar la información del postulante aceptado :
const registerPostulante = async (id, ) => {
    
    try {
        const response = await Postulante.findByPk(id);
        if (response) await response.update({
            nombres, apellidos, dni, ruc, f_nacimiento, talla, hijos, correo, domicilio, celular,
            carrera, cv, observaciones, id_distrito, id_cargo, id_subgerencia, id_entidad,
            cuenta, cci, clave_sol, clave_cul
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al evaluar al postulante luego de la prueba física',
            data: error
        });
        return false;
    }
};

// ---------------------------------------------------------------------------------------------------------------------------------- //
// -----------------------------------------------  MÓDULOS DE POSTULANTES - GENERAL  ----------------------------------------------- //
// ---------------------------------------------------------------------------------------------------------------------------------- //

// < 01 > - Obtener todos los postulantes de una convocatoria con paginación, búsqueda y filtros :
const getAllPostulantes = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni, blacklist, state } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo }),
            ...(blacklist !== undefined && { state_blacklist: blacklist }),
            ...(state !== undefined && { state_accept: state }),
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes',
            data: error
        });
        return false;
    }
};

// < 02 > - Obtener todos los postulantes que tenían la posibilidad de rendir la prueba psicológica con paginación, búsqueda y filtros :
const getAllPostulantesPsicologia = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni, prueba, state } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
            state_blacklist: false,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo }),
            ...(prueba !== undefined && { prueba_psicologica: prueba }),
            ...(state !== undefined && { state_psicologica: state })
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes',
            data: error
        });
        return false;
    }
};

// < 03 > - Obtener todos los postulantes que tenían la posibilidad de rendir la prueba física con paginación, búsqueda y filtros :
const getAllPostulantesFisica = async (page = 1, limit = 20, filters = {}, id_convocatoria) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, dni, prueba, state } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
            id_convocatoria: id_convocatoria,
            state_blacklist: false,
            prueba_psicologica: true,
            state_psicologica: true,
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
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo }),
            ...(prueba !== undefined && { prueba_psicologica: prueba }),
            ...(state !== undefined && { state_psicologica: state })
        };

        const includeConditions = [
            { model: Distrito, as: 'distrito', attributes: ['nombre'] },
            { model: Entidad, as: 'entidad', attributes: ['nombre'] },
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: Convocatoria, as: 'convocatoria', attributes: ['mes', 'year', 'numero'] }
        ];

        const response = await Postulante.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
            order: [['apellidos', 'ASC']]
        });

        return {
            totalCount: response.count,
            data: response.rows
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todos los postulantes',
            data: error
        });
        return false;
    }
};

// ---------------------------------------------------------------------------------------------------------------------------------- //
// ---------------------------------- MOSTRAR TODOS LOS POSTULANTES DE LAS DISTINTAS CONVOCATORIAS  --------------------------------- //
// ---------------------------------------------------------------------------------------------------------------------------------- //

// Obtener a todos los postulantes con sus convocatorias correspondientes :


// ---------------------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------- CREACIÓN, ACTUALIZACIÓN Y ELIMINACIÓN DE UN POSTULANTE  ------------------------------------ //
// ---------------------------------------------------------------------------------------------------------------------------------- //

// Crear la información inicial de un postulante :
const createPostulante = async (
    nombres, apellidos, dni, ruc, f_nacimiento, talla, hijos, correo, domicilio, celular, f_registro,
    carrera, cv, observaciones, id_distrito,
    id_cargo, id_sexo, id_regimen_laboral, id_grado_estudios, id_subgerencia, id_convocatoria, state_blacklist
) => {

    try {
        const response = await Postulante.create({
            nombres, apellidos, dni, ruc, f_nacimiento, talla, hijos, correo, domicilio, celular, f_registro,
            carrera, cv, observaciones, id_distrito,
            id_cargo, id_sexo, id_regimen_laboral, id_grado_estudios, id_subgerencia, id_convocatoria, state_blacklist
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear al postulante',
            data: error
        });
        return false;
    }
};

// Actualizar la información inicial de un postulante :
const updatePostulante = async (
    id, nombres, apellidos, dni, ruc, f_nacimiento, talla, hijos, correo, domicilio, celular,
    carrera, cv, observaciones, id_distrito,
    id_cargo, id_sexo, id_regimen_laboral, id_grado_estudios, id_subgerencia, id_convocatoria, state_blacklist
) => {

    try {
        const response = await Postulante.findByPk(id);
        await response.update({
            nombres, nombres, apellidos, dni, ruc, f_nacimiento, talla, hijos, correo, domicilio, celular,
            carrera, cv, observaciones, id_distrito,
            id_cargo, id_sexo, id_regimen_laboral, id_grado_estudios, id_subgerencia, id_convocatoria, state_blacklist
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar al postulante',
            data: error
        });
        return false;
    }
};

// Cambio del estado del postulante (Opcional) :
const deletePostulante = async (id) => {

    try {
        const response = await Postulante.findByPk(id);
        if (!response) return null;
        const estado = response.state;
        response.state = !estado;
        await response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al cambiar de estado al postulante',
            data: error
        });
        return false;
    }
};

module.exports = {
    getPostulante,
    getPostulanteById,
    getPostulantesActual,
    getBlackListActual,
    getPsicologiaActual,
    asistenciaPsicologiaActual,
    getPsicologiaRevisionActual,
    evaluatePsicologiaActual,
    getFisicaActual,
    asistenciaFisicaActual,
    getFisicaRevisionActual,
    evaluateFisicaActual,
    getEntrevistaActual,
    acceptPostulanteActual,
    registerPostulante,
    getAllPostulantes,
    getAllPostulantesPsicologia,
    getAllPostulantesFisica,
    createPostulante,
    updatePostulante,
    deletePostulante
};