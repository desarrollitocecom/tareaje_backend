const { Asistencia, Empleado, Cargo, Turno } = require('../db_connection');
const { Op } = require('sequelize');

// Obtener la asistencias por ID (formato UUID) :
const getAsistenciaById = async (id) => {

    try {
        const asistencia = await Asistencia.findByPk(id);
        return asistencia || null;
    } catch (error) {
        console.error('Error al obtener la asistencia por ID: ', error);
        return false;
    }
};

// Obtener las asistencias (todos los estados) de un día determinado :
const getAsistenciaDiaria = async (page = 1, limit = 20, fecha) => {
    
    const offset = (page - 1) * limit;

    try {
        const asistencias = await Asistencia.findAndCountAll({
            where: {
                fecha: fecha
            },
            include: [
                {
                    model: Empleado,
                    as: 'empleado',
                    attributes: ['nombres', 'apellidos', 'dni', 'foto'],
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
            ],
            limit,
            offset,
            order: [['hora', 'ASC']]
        });

        // Mapeo del resultado para estructurar de asistencia y empleado
        const result = asistencias.rows.map(asistencia => ({
            id_asistencia: asistencia.id,
            fecha: asistencia.fecha,
            hora: asistencia.hora,
            estado: asistencia.estado,
            id_empleado: asistencia.id_empleado,
            photo_id: asistencia.photo_id,
            nombres: asistencia.empleado.nombres,
            apellidos: asistencia.empleado.apellidos,
            dni: asistencia.empleado.dni,
            foto: asistencia.empleado.foto,
            cargo: asistencia.empleado.cargo ? asistencia.empleado.cargo.nombre : null,
            turno: asistencia.empleado.turno ? asistencia.empleado.turno.nombre : null
        }));

        return {
            data: result,
            currentPage: page,
            totalCount: asistencias.count
        };

    } catch (error) {
        console.error('Error al obtener las asistencias de un día determinado:', error);
        return false;
    }
};

// Obtener asistencias (todos los estados) en un rango de fechas :
const getAsistenciaRango = async (page = 1, pageSize = 20, inicio, fin) => {
    
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const dias = [];

    let fechaDate = new Date(inicio);
    while (fechaDate <= new Date(fin)) {
        dias.push(new Date(fechaDate).toISOString().split('T')[0]);
        fechaDate.setDate(fechaDate.getDate() + 1);
    }

    try {
        const empleados = await Empleado.findAndCountAll({
            include: [
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Turno, as: 'turno', attributes: ['nombre'] }
            ],
            limit,
            offset,
            order: [['apellidos', 'ASC']]
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
            const { id, id_empleado, fecha, estado} = asistencia;
            if (!asistenciaMap[id_empleado]) asistenciaMap[id_empleado] = {};
            asistenciaMap[id_empleado][fecha] = { estado, id};
        });

        const result = empleados.rows.map(empleado => ({
            id_empleado: empleado.id,
            nombres: empleado.nombres,
            apellidos: empleado.apellidos,
            dni: empleado.dni,
            cargo: empleado.cargo ? empleado.cargo.nombre : null,
            turno: empleado.turno ? empleado.turno.nombre : null,
            estados: dias.map(fecha => {
                const asistencia = asistenciaMap[empleado.id]?.[fecha];
                return {
                    fecha,
                    asistencia: asistencia ? asistencia.estado : null,
                    id_asistencia: asistencia ? asistencia.id : null
                };
            })
        }));

        return {
            data: result,
            currentPage: page,
            totalCount: empleados.count
        };

    } catch (error) {
        console.error('Error al obtener las asistencias de un rango de fechas:', error);
        return false;
    }
};

// Obtener ids asistencias con datos de empleado en un rango de fechas :
const getIdsAsistenciaRango = async (id_empleado, inicio, fin) => {
    
    const dias = [];

    let fechaDate = new Date(inicio);
    while (fechaDate <= new Date(fin)) {
        dias.push(new Date(fechaDate).toISOString().split('T')[0]);
        fechaDate.setDate(fechaDate.getDate() + 1);
    }

    try {
        const asistencias = await Asistencia.findAll({
            where: {
                fecha: { [Op.between]: [inicio, fin] },
                id_empleado: id_empleado
            },
            include: [{ model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos', 'dni'] }]
        });
        if (!asistencias) return null;

        const nombre = asistencias[0].empleado.nombres;
        const apellido = asistencias[0].empleado.apellidos;
        const dni = asistencias[0].empleado.dni;

        const info = [];
        asistencias.forEach(a => {
            const id = a.id;
            const fecha = a.fecha;
            const estado = a.estado
            const carga = {id, fecha, estado};
            info.push(carga);
        });
        
        const result = { nombre, apellido, dni, info };
        return result;

    } catch (error) {
        console.error('Error al obtener las asistencias de un rango de fechas:', error);
        return false;
    }
};

// Obtener todas las asistencias :
const getAllAsistencias = async (page = 1, pageSize = 20) => {
    
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    
    try {
        const response = await Asistencia.findAndCountAll({
            limit,
            offset,
            order: [['fecha', 'ASC']]
        });

        return {
            data: response.rows,
            currentPage: page,
            totalCount: response.count,
        };

    } catch (error) {
        console.error('Error al obtener todas los asistencias:', error);
        return false;
    }
};

// Crear Asistencia desde el algoritmo (SIN HANDLER) :
const createAsistencia = async (fecha, hora, estado, id_empleado, photo_id) => {
    
    // Validaciones para crear de forma correcta la asistencia correspondiente :
    if(!fecha){
        console.error('Es necesario que exista el parámetro FECHA');
        return false;
    }
    if(!hora){
        console.error('Es necesario que exista el parámetro HORA');
        return false;
    }
    if(!estado){
        console.error('Es necesario que exista el parámetro ESTADO');
        return false;
    }
    if(!id_empleado){
        console.error('Es necesario que exista el parámetro ID EMPLEADO');
        return false;
    }
    if(!photo_id){
        console.error('Es necesario que exista el parámetro PHOTO ID');
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
        const newAsistencia = await Asistencia.create({
            fecha: fecha,
            hora: hora,
            estado: estado,
            id_empleado: id_empleado,
            photo_id: photo_id
        });
        if (newAsistencia){
            console.log('Asistencia creada exitosamente');
            return newAsistencia;
        }
        else{
            console.warn('Resultado nulo: No se pudo crear la asistencia');
            return null;
        }
    } catch (error) {
        console.error('Error al crear una nueva asistencia:', error);
        return false;
    }
};

// Crear asistencia, esto lo realizará un usuario (sin photo_id) :
const createAsistenciaUsuario = async (fecha, hora, estado, id_empleado) => {
    
    try {
        const asistencias = await Asistencia.findAndCountAll({
            where: {
                fecha: fecha,
                hora: hora,
                id_empleado: id_empleado
            }
        })
        if (asistencias.rows.length) return 1;

        const newAsistencia = await Asistencia.create({
            fecha: fecha,
            hora: hora,
            estado: estado,
            id_empleado: id_empleado,
            photo_id: "Asistencia manual"
        });
        return newAsistencia || null;

    } catch (error) {
        console.error('Error al crear una nueva asistencia:', error);
        return false;
    }
};

// Actualizar la asistencia :
// >> Dirigirse al controlador de Justificaciones: createJustificacion

// Filtrar solo las asistencias de un día determinado :
const filtroAsistenciaDiaria = async (page = 1, pageSize = 20, fecha) => {
    
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    try {
        const asistencias = await Asistencia.findAndCountAll({
            where: {
                fecha: fecha,
                estado: 'A'
            },
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
            ],
            order: [['hora', 'ASC']]
        });

        // Mapeo del resultado para estructurar de asistencia y empleado
        const result = asistencias.rows.map(asistencia => ({
            id_asistencia: asistencia.id,
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
            data: result,
            currentPage: page,
            totalCount: asistencias.count
        };
    } catch (error) {
        console.error('Error al obtener las asistencias de un día determinado:', error);
        return false;
    }
};

module.exports = {
    getAsistenciaById,
    getAsistenciaDiaria,
    getAsistenciaRango,
    getIdsAsistenciaRango,
    getAllAsistencias,
    createAsistencia,
    createAsistenciaUsuario,
    filtroAsistenciaDiaria
};