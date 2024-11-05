const { Asistencia } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener la asistencias por id :
const getAsistenciaById = async (id) => {
    try {
        const asistencia = await asistencia.findByPk(id);
        return asistencia || null;
    } catch (error) {
        console.error('Error al obtener la asistencia por ID: ', error);
        return false;
    }
};

// Obtener las asistencias de un día determinado :
const getAsistenciaDiaria = async (page = 1, limit = 20, fecha) => {
    const offset = (page - 1) * limit;
    try {
        const asistencias = await Asistencia.findAndCountAll({
            where: { fecha },
            limit,
            offset
        });
        return {
            total: asistencias.count,
            data: asistencias.rows,
            currentPage: page
        } || null;
    } catch (error) {
        console.error('Error al obtener las asistencias de un día determinado:', error);
        return false;
    }
};

// Obtener las asistencias de un determinado rango :
const getAsistenciaRango = async (page = 1, limit = 20, inicio, fin) => {
    const offset = (page - 1) * limit;
    try {
        const asistencias = await Asistencia.findAndCountAll({
            where: {
                fecha: { [Op.between]: [inicio, fin] }
            },
            limit,
            offset
        });
        return {
            total: asistencias.count,
            data: asistencias.rows,
            currentPage: page
        } || null;
    } catch (error) {
        console.error('Error al obtener las asistencias de un rango de fechas:', error);
        return false;
    }
};

// Obtener todas las asistencias :
const getAllAsistencias = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const asistencias = await Asistencia.findAndCountAll({
            limit,
            offset
        });
        return {
            total: asistencias.count,
            data: asistencias.rows,
            currentPage: page
        } || null;
    } catch (error) {
        console.error('Error al obtener todos los asistencias:', error);
        return false;
    }
};

// Crear la Asistencia obtenida desde el algoritmo correspondiente :
const createAsistencia = async ({fecha, hora, estado, id_empleado, photo_id}) => {
    
    // Validaciones para crear de forma correcta la asistencia correspondiente :
    const respuestaFalta = 'Es necesario que exista el parámetro'
    if(!fecha){
        console.error(`${respuestaFalta} FECHA`);
        return null;
    }
    if(!hora){
        console.error(`${respuestaFalta} HORA`);
        return null;
    }
    if(!estado){
        console.error(`${respuestaFalta} ESTADO`);
        return null;
    }
    if(!id_empleado){
        console.error(`${respuestaFalta} ID EMPLEADO`);
        return null;
    }
    if(!photo_id){
        console.error(`${respuestaFalta} PHOTO ID`);
        return null;
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha)){
        console.error('El formato para la FECHA es incorrecto');
        return null;
    }
    if(!/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(hora)){
        console.error('El formato para la HORA es incorrecto');
        return null;
    }
    if(!["A", "F", "DM", "DO", "V", "DF", "LSG", "LCG", "LF", "PE"].includes(estado)){
        console.error('El estado ingresado no es el correspondiente');
        return null;
    }
    if(isNaN(id_empleado)){
        console.error('El formato para el ID EMPLEADO debe ser un entero');
        return null;
    }
    try {
        const newAsistencia = await Asistencia.create({fecha, hora, estado, id_empleado, photo_id});
        return newAsistencia || null;
    } catch (error) {
        console.error('Error al crear una nueva asistencia:', error);
        return false;
    }
};

// Actualizar la Asistencia de una persona :
const updateAsistencia = async (id, newEstado) => {
    try {
        const asistencia = await Asistencia.findByPk(id);
        if (!asistencia) {
            console.error('No se encontró la asistencia con el ID proporcionado...');
            return false;
        }
        const [numUpdated] = await Asistencia.update(
            { estado: newEstado },
            {
                where: { id } // Actualiza basado en el ID de la asistencia
            }
        );
        if (numUpdated === 0) {
            console.error('No se encontró asistencia para actualizar o ya está actualizada');
            return false;
        }
        console.log('Estado de asistencia actualizado correctamente');
        return true;

    } catch (error) {
        console.error('Error al actualizar la asistencia: ', error);
        return false;
    }
};

module.exports = {
    getAsistenciaById,
    getAsistenciaDiaria,
    getAsistenciaRango,
    getAllAsistencias,
    createAsistencia,
    updateAsistencia
};