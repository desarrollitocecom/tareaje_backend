const { RangoHorario, Turno, Subgerencia } = require('../db_connection');
const { Sequelize, Op, where } = require('sequelize');
const { getFuncion } = require('../controllers/funcionController');

// Obtener un Rango Horario por ID :
const getRangoHorarioById = async (id) => {

    try {
        const rango = await RangoHorario.findByPk(id);
        return rango || null;

    } catch (error) {
        console.error('Error al obtener el Rango Horario por ID:', error);
        return false;
    }
};

// Obtener un Rango Horario por ID de función :
const getRangoHorarioByFuncion = async (id_funcion) => {
    
    try {
        const response = await RangoHorario.findOne({
            where: {
                ids_funcion: { [Op.contains]: [id_funcion] }
            },
            raw: true
        })
        return response || null;

    } catch (error) {
        console.error('Error al obtener el horario por el id de función');
        return false;
    }
}

// Obtener todos los horarios que contegan una función en específico :
const getAllRangoHorariosByFuncion = async (id_funcion) => {
    
    try {
        const response = await RangoHorario.findAll({
            where: {
                state: true,
                ids_funcion: { [Op.contains]: [id_funcion]}
            },
            raw: true
        })
        return response || null;
        
    } catch (error) {
        console.error('Error al obtener los horarios por función:', error);
        return false;
    }
}

// Obtener los Rangos de Horario con paginación y búsqueda :
const getAllRangosHorarios = async (page = 1, limit = 20, filters = {}) => {

    const { search } = filters;
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        const whereCondition = {
            state: true,
            ...(search && {
                [Op.or]: [{ nombre: { [Op.iLike]: `%${search}%` }}]
            })
        };

        const includeCondition = [
            { model: Turno, as: 'turno', attributes: ['nombre'] },
            { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] }
            
        ];

        const { count, rows } = await RangoHorario.findAndCountAll({
            where: whereCondition,
            include: includeCondition,
            order: [['nombre', 'ASC']],
            limit,
            offset,
        });

        return { data: rows, totalCount: count } || null;

    } catch (error) {
        console.error('Error al obtener todos los rangos de horario:', error);
        return false;
    }
};

// Obtener todos los Rangos de Horario para el algoritmo (SIN HANDLER) :
const getRangosHorariosHora = async (hora) => {

    try {
        const horaStr = (hora < 10) ? `0${hora}:00:00` : `${hora}:00:00`;
        const response = await RangoHorario.findAll({
            where: {
                state: true,
                inicio: horaStr,
            },
            attributes: ['ids_funcion', 'id_turno'],
            raw: true
        });
        if(!response || response.length === 0) return [];
        const result = {
            ids_funcion: response.flatMap(item => item.ids_funcion),
            id_turno: response[0].id_turno,
        };
        return result;

    } catch (error) {
        console.error('Error al obtener los rangos de horario por hora:', error);
        return false;
    }
};

// Validar si existe un horario con el área y la subgerencia correspondiente :
const getRangoHorarioAreaSubgerencia = async (nombre, id_subgerencia) => {

    try {
        const rango = await RangoHorario.findOne({
            where: { state:true, nombre: nombre, id_subgerencia: id_subgerencia }
        });
        if (!rango) return false;
        return true;

    } catch (error) {
        console.error('Error al obtener el horario por área y subgerencia:', error);
        return false;
    }
};

// Obtener todas las areas que estén presentes en los Rangos de Horario :
const getAreaRangoHorario = async () => {
    
    try {
        const rango = await RangoHorario.findAll({
            where: { state: true },
            attributes: ['nombre'],
            raw: true
        });
        if (!rango || rango.length === 0) return null;
        const general = new Set();
        rango.forEach(e => general.add(e.nombre));
        return Array.from(general);

    } catch (error) {
        console.error('Error al obtener las areas de los horarios');
        return false;
    }
};

// Crear un nuevo RangoHorario :
const createRangoHorario = async (nombre, inicio, fin, ids_funcion, id_turno, id_subgerencia) => {

    try {
        const response = await RangoHorario.create({
            nombre,
            inicio,
            fin,
            ids_funcion,
            id_turno,
            id_subgerencia
        });
        return response || null;

    } catch (error) {
        console.error('Error al crear un nuevo rango de horario:', error);
        return false;
    }
};

// Actualizar un Rango Horario
const updateRangoHorario = async (id, nombre, inicio, fin, ids_funcion, id_turno, id_subgerencia) => {

    try {
        const rango = await RangoHorario.findByPk(id);
        if (!rango) return 1;

        const funciones = rango.ids_funcion;
        const beforeUpdate = funciones.filter(f => !ids_funcion.includes(f));
        const afterUpdate = ids_funcion.filter(f => !funciones.includes(f));
        const funcionesDelete = [];
        const funcionesUpdate = [];

        const erroresRango = [];
        for (const funcion of afterUpdate) {
            const rangoExist = await getAllRangoHorariosByFuncion(funcion);
            if (!rangoExist || rangoExist.length === 0) continue;
            const rangoFilter = rangoExist.filter(r => r.nombre !== nombre);
            const funcionInfo = await getFuncion(funcion);
            const funcionName = funcionInfo.nombre;
            if (rangoFilter.length > 0) erroresRango.push(funcionName);
        }
        if (erroresRango.length > 0) return erroresRango;

        for (const funcion of beforeUpdate) {
            const rangoExist = await getAllRangoHorariosByFuncion(funcion);
            if (!rangoExist || rangoExist.length === 0) funcionesDelete.push(funcion);
            await rango.update(
                { ids_funcion: Sequelize.fn('array_remove', Sequelize.col('ids_funcion'), funcion) }
            );
        }

        for (const funcion of afterUpdate) {
            const rangoExist = await getAllRangoHorariosByFuncion(funcion);
            if (!rangoExist || rangoExist.length === 0) funcionesUpdate.push(funcion);
        }

        // Rango establecido para reubicar las funciones después de la eliminación de ese rango :
        const rangoNull = await RangoHorario.findByPk(7);
        if (funcionesDelete.length > 0) {
            for (const funcion of funcionesDelete) {
                await rangoNull.update(
                    { ids_funcion: Sequelize.fn('array_append', Sequelize.col('ids_funcion'), funcion) }
                );
            }
        }
        if (funcionesUpdate.length > 0) {
            for (const funcion of funcionesUpdate) {
                await rangoNull.update(
                    { ids_funcion: Sequelize.fn('array_remove', Sequelize.col('ids_funcion'), funcion) }
                )
            }
        }

        const response = await rango.update({
            nombre,
            inicio,
            fin,
            ids_funcion,
            id_turno,
            id_subgerencia
        });
        return response || null;

    } catch (error) {
        console.error('Error al actualizar el rango de horario:', error);
        return false;
    }
};

// Añadir un id de función a un rango de horario determinado :
const updateFuncionRangoHorario = async (tipo, id_subgerencia, id_funcion) => {
    
    try {
        const result = await RangoHorario.update(
            { ids_funcion: Sequelize.fn('array_append', Sequelize.col('ids_funcion'), id_funcion) },
            { where: { state: true, nombre: tipo, id_subgerencia: id_subgerencia }}
        );
        return result || null;

    } catch (error) {
        console.error('Error al añadir función a un rango de horario:', error);
        return false;
    }
};

// Eliminar un Rango Horario (Cambio del state a false)
const deleteRangoHorario = async (id) => {

    try {
        const rangoDelete = await RangoHorario.findOne({
            where: { state: true, id: id }
        });
        if (!rangoDelete) return 1;

        // Cambiar el state a false :
        rangoDelete.state = false;
        await rangoDelete.save();
        if (!rangoDelete) return null;

        // Rango establecido para reubicar las funciones después de la eliminación de ese rango :
        const rangoNull = await RangoHorario.findByPk(7);
    
        const funciones = rangoDelete.ids_funcion;
        const funcionesDelete = [];

        for (const funcion of funciones) {
            const rangoExist = await getAllRangoHorariosByFuncion(funcion);
            if (!rangoExist || rangoExist.length === 0) funcionesDelete.push(funcion);
            await rangoDelete.update(
                { ids_funcion: Sequelize.fn('array_remove', Sequelize.col('ids_funcion'), funcion) },
            );
        }

        if (funcionesDelete.length > 0) {
            for (const funcion of funcionesDelete) {
                await rangoNull.update(
                    { ids_funcion: Sequelize.fn('array_append', Sequelize.col('ids_funcion'), funcion) },
                );
            }
        }

        const response = {
            id: rangoDelete.id,
            nombre: rangoDelete.nombre,
            inicio: rangoDelete.inicio,
            fin: rangoDelete.fin,
            state: rangoDelete.state,
            id_turno: rangoDelete.id_turno,
            id_subgerencia: rangoDelete.id_subgerencia
        };
    
        return response;
    
    } catch (error) {
        console.error('Error al procesar los rangos de horario:', error.message, error.stack);
        return false;
    }
};

// Eliminar un id de función a un rango de horario determinado :
const deleteFuncionRangoHorario = async (id_funcion) => {
    
    try {
        const result = await RangoHorario.update(
            { ids_funcion: Sequelize.fn('array_remove', Sequelize.col('ids_funcion'), id_funcion) },
            { where: { state: true }}
        );
        return result || null;

    } catch (error) {
        console.error('Error al eliminar función de un rango de horario:', error);
        return false;
    }
};

module.exports = {
    getRangoHorarioById,
    getRangoHorarioByFuncion,
    getAllRangosHorarios,
    getRangosHorariosHora,
    getAreaRangoHorario,
    getRangoHorarioAreaSubgerencia,
    createRangoHorario,
    updateRangoHorario,
    updateFuncionRangoHorario,
    deleteRangoHorario,
    deleteFuncionRangoHorario
};
