const { Postulante, Distrito, Entidad, Convocatoria, Cargo, Sexo, GradoEstudios, Subgerencia } = require('../db_connection');
const { Op } = require('sequelize');

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

// Obtener todos los postulantes con paginación, búsqueda y filtros :
const getAllPostulantes = async (page = 1, limit = 20, filters = {}) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, convocatoria, dni, edadMin, edadMax, hijosMin, hijosMax } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    // Calcular fechas basadas en edad mínima y máxima :
    const today = new Date();
    const dateFromEdadMin = edadMax ? new Date(today.getFullYear() - edadMax - 1, today.getMonth(), today.getDate() + 1) : null;
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
            ...(subgerencia && { id_subgerencia: subgerencia }),
            ...(cargo && { id_cargo: cargo }),
            ...(regimen && { id_regimen_laboral: regimen }),
            ...(grado && { id_grado_estudios: grado }),
            ...(sexo && { id_sexo: sexo }),
            ...(convocatoria && { id_convocatoria: convocatoria }),
            ...(validDateFromEdadMin && validDateFromEdadMax && {
                f_nacimiento: { [Op.between]: [dateFromEdadMin, dateFromEdadMax] },
            }),
            ...(hijosMin && hijosMax && {
                hijos: { [Op.between]: [hijosMin, hijosMax] }
            })
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

// Obtener todos los postulantes con paginación, búsqueda y filtros :
const getAllPostulantesBlackList = async (page = 1, limit = 20, filters = {}) => {

    const { search, subgerencia, cargo, regimen, grado, sexo, convocatoria, dni, edadMin, edadMax, hijosMin, hijosMax } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    // Calcular fechas basadas en edad mínima y máxima :
    const today = new Date();
    const dateFromEdadMin = edadMax ? new Date(today.getFullYear() - edadMax - 1, today.getMonth(), today.getDate() + 1) : null;
    const dateFromEdadMax = edadMin ? new Date(today.getFullYear() - edadMin, today.getMonth(), today.getDate()) : null;

    // Asegurarse de que dateFromEdadMin y dateFromEdadMax son fechas válidas :
    const validDateFromEdadMin = dateFromEdadMin instanceof Date && !isNaN(dateFromEdadMin);
    const validDateFromEdadMax = dateFromEdadMax instanceof Date && !isNaN(dateFromEdadMax);

    try {
        // Construcción dinámica de condiciones :
        const whereCondition = {
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
            ...(sexo && { id_sexo: sexo }),
            ...(convocatoria && { id_convocatoria: convocatoria }),
            ...(validDateFromEdadMin && validDateFromEdadMax && {
                f_nacimiento: { [Op.between]: [dateFromEdadMin, dateFromEdadMax] },
            }),
            ...(hijosMin && hijosMax && {
                hijos: { [Op.between]: [hijosMin, hijosMax] }
            })
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
            message: 'Error en el controlador al obtener todos los postulantes de la Black List',
            data: error
        });
        return false;
    }
};

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

// Cambio del estado del postulante (En proceso - ) :
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
    getAllPostulantes,
    getAllPostulantesBlackList,
    createPostulante,
    updatePostulante,
    deletePostulante
};