const {
    BlackList, Cargo, RegimenLaboral, Sexo, Jurisdiccion, GradoEstudios, LugarTrabajo, Subgerencia, Turno, Funcion, Area
} = require('../db_connection');

const { Op } = require('sequelize');
const { searchBestSimilarity } = require('../utils/similarity');

// Obtener los datos de la Black List por ID :
const getBlackListByID = async (id) => {
    
    try {        
        const includeConditions = [
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Turno, as: 'turno', attributes: ['nombre'] },
            { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: Jurisdiccion, as: 'jurisdiccion', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: LugarTrabajo, as: 'lugarTrabajo', attributes: ['nombre'] },
            { model: Funcion, as: 'funcion', attributes: ['nombre'] },
            { model: Area, as: 'area', attributes: ['nombre'] }
        ];

        const response = BlackList.findOne({
            where: { id },
            include: includeConditions
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener los datos de la Black List por ID',
            data: error.message
        });
        return false;
    }
};

// Obtener los datos de la Black List por DNI : 
const getBlackListByDNI = async (dni) => {

    try {
        const includeConditions = [
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Turno, as: 'turno', attributes: ['nombre'] },
            { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: Jurisdiccion, as: 'jurisdiccion', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: LugarTrabajo, as: 'lugarTrabajo', attributes: ['nombre'] },
            { model: Funcion, as: 'funcion', attributes: ['nombre'] },
            { model: Area, as: 'area', attributes: ['nombre'] }
        ];

        const response = await BlackList.findOne({
            where: { dni },
            include: includeConditions
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener los datos de la Black List por DNI',
            data: error.message
        });
        return false;
    }
};

// Obtener todos los datos de todo el personal de la Black List :
const getAllBlackList = async (page = 1, limit = 20, filters = {}) => {

    const { search, dni, periodo } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;
    
    let start, end;
    console.log(periodo);
    if (periodo) {
        const year = parseInt(periodo.split('-')[0]);
        const month = parseInt(periodo.split('-')[1]);
        const inicio = new Date(year, month - 1, 1);
        const fin = new Date(year, month, 0);
        start = inicio.toISOString().split('T')[0];
        end = fin.toISOString().split('T')[0];
    }

    try {
        const whereCondition = {
            ...(search && {
                [Op.and]: search.split(' ').map((term) => ({
                    [Op.or]: [
                        { nombres: { [Op.iLike]: `%${term}%` }},
                        { apellidos: { [Op.iLike]: `%${term}%` }},
                    ],
                })),
            }),
            ...(dni && { dni: { [Op.iLike]: `%${dni}%` }}),
            ...(periodo && { f_fin: { [Op.between]: [start, end] }})
        }

        const includeConditions = [
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Turno, as: 'turno', attributes: ['nombre'] },
            { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            { model: Jurisdiccion, as: 'jurisdiccion', attributes: ['nombre'] },
            { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
            { model: LugarTrabajo, as: 'lugarTrabajo', attributes: ['nombre'] },
            { model: Funcion, as: 'funcion', attributes: ['nombre'] },
            { model: Area, as: 'area', attributes: ['nombre'] }
        ];

        const response = await BlackList.findAndCountAll({
            where: whereCondition,
            include: includeConditions,
            limit,
            offset,
        });

        return {
            totalCount: response.count,
            data: response.rows,
            currentPage: page
        } || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todas las áreas',
            data: error
        });
        return false;
    }
};

// Validación para detectar si la persona entrante pertenece a la Black List :
const validateBlackList = async (nombres, apellidos, dni) => {
    
    const response = await BlackList.findAll({
        attributes: ['nombres', 'apellidos', 'dni'],
        raw: true
    });

    const filtro1 = response.find(black => black.dni === dni);
    if (filtro1) return true;

    const completoEmpleado = `${apellidos} ${nombres}`;
    const completoBlackList = response.map(black => `${black.apellidos} ${black.nombres}`);
    const filtro2 = searchBestSimilarity(completoEmpleado, completoBlackList);
    if (filtro2) return true;

    // Si no encuentra similitud en el DNI y en el nombre completo entonces es ACEPTADO :
    return false;
};

// Ingresar una persona dentro de la Black List (SIN RETORNO) :
const createBlackListEmpleado = async (
    nombres, apellidos, dni, motivo, f_fin, id_cargo, id_turno, id_regimen_laboral, id_sexo, 
    id_jurisdiccion, id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area
) => {

    try {
        const response = await BlackList.create({
            nombres, apellidos, dni, motivo, f_fin, id_cargo, id_turno, id_regimen_laboral, id_sexo, 
            id_jurisdiccion, id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo, id_area
        });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear un empleado en la Black List',
            data: error
        });
        return false;
    }
};

module.exports = {
    getBlackListByID,
    getBlackListByDNI,
    getAllBlackList,
    validateBlackList,
    createBlackListEmpleado,
};