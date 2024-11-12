const { Asistencia, Empleado, Cargo, Turno } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener la asistencias por id :
const getAsistenciaById = async (id) => {
    try {
        const asistencia = await Asistencia.findByPk(id);
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
            offset,
            include: [
                {
                    model: Empleado,
                    as: 'empleado',
                    attributes: ['nombres', 'apellidos', 'dni'],
                    include: [
                        {
                            model: Cargo,
                            as: 'cargo',
                            attributes: ['nombre']
                        },
                        {
                            model: Turno,
                            as: 'turno',
                            attributes: ['nombre']
                        }
                    ]
                }
            ]
        });

        // Mapeo del resultado para estructurar de asistencia y empleado
        const result = asistencias.rows.map(asistencia => ({
            fecha: asistencia.fecha,
            hora: asistencia.hora,
            estado: asistencia.estado,
            id_empleado: asistencia.id_empleado,
            photo_id: asistencia.photo_id,
            nombres: asistencia.empleado.nombres,
            apellidos: asistencia.empleado.apellidos,
            dni: asistencia.empleado.dni,
            cargo: asistencia.empleado.cargo ? asistencia.empleado.cargo.nombre : null,
            turno: asistencia.empleado.turno ? asistencia.empleado.turno.nombre : null
        }));

        return {
            total: asistencias.count,
            data: result,
            currentPage: page
        };
    } catch (error) {
        console.error('Error al obtener las asistencias de un día determinado:', error);
        return false;
    }
};

// Obtener asistencias en un rango de horarios :
const getAsistenciaRango = async (page = 1, limit = 20, inicio, fin) => {
    
    const offset = (page - 1) * limit;

    const dias = [];
    let fechaDate = new Date(inicio);
    while (fechaDate <= new Date(fin)) {
        dias.push(new Date(fechaDate).toISOString().split('T')[0]);
        fechaDate.setDate(fechaDate.getDate() + 1);
    }

    try {
        const empleados = await Empleado.findAndCountAll({
            limit,
            offset,
            include: [
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Turno, as: 'turno', attributes: ['nombre'] }
            ]
        });

        const asistencias = await Asistencia.findAll({
            where: {
                fecha: { [Op.between]: [inicio, fin] }
            },
            include: [{ model: Empleado, as: 'empleado', attributes: ['id'] }]
        });

        // Mapeo de las asistencias por empleado y fecha :
        const asistenciaMap = {};
        asistencias.forEach(asistencia => {
            const { id_empleado, fecha, estado } = asistencia;
            if (!asistenciaMap[id_empleado]) asistenciaMap[id_empleado] = {};
            asistenciaMap[id_empleado][fecha] = estado;
        });

        const result = empleados.rows.map(empleado => ({
            id_empleado: empleado.id,
            nombres: empleado.nombres,
            apellidos: empleado.apellidos,
            dni: empleado.dni,
            cargo: empleado.cargo ? empleado.cargo.nombre : null,
            turno: empleado.turno ? empleado.turno.nombre : null,
            estados: dias.map(fecha => ({
                fecha,
                asistencia: asistenciaMap[empleado.id]?.[fecha] || null
            }))
        }));

        return result || null;
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

// Crear Asistencia desde el algorimo (SIN HANDLER) :
const createAsistencia = async (fecha, hora, estado, id_empleado, photo_id) => {
    
    // Validaciones para crear de forma correcta la asistencia correspondiente :
    const respuestaFalta = 'Es necesario que exista el parámetro'
    if(!fecha){
        console.error(`${respuestaFalta} FECHA`);
        return false;
    }
    if(!hora){
        console.error(`${respuestaFalta} HORA`);
        return false;
    }
    if(!estado){
        console.error(`${respuestaFalta} ESTADO`);
        return false;
    }
    if(!id_empleado){
        console.error(`${respuestaFalta} ID EMPLEADO`);
        return false;
    }
    if(!photo_id){
        console.error(`${respuestaFalta} PHOTO ID`);
        return false;
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha)){
        console.error('El formato para la FECHA es incorrecto');
        return false;
    }
    if(!/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(hora)){
        console.error('El formato para la HORA es incorrecto');
        return false;
    }
    if(!["A", "F", "DM", "DO", "V", "DF", "LSG", "LCG", "LF", "PE"].includes(estado)){
        console.error('El estado ingresado no es el correspondiente');
        return false;
    }
    if(isNaN(id_empleado)){
        console.error('El formato para el ID EMPLEADO debe ser un entero');
        return false;
    }

    try {
        const nuevaAsistencia = await Asistencia.create({
            fecha: fecha,
            hora: hora,
            estado: estado,
            id_empleado: id_empleado,
            photo_id: photo_id
        });
        if(nuevaAsistencia){
            console.log('Asistencia creada exitosamente');
            return true;
        }
        else{
            console.warn('Resultado nulo: No se pudo crear la asistencia');
            return false;
        }
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