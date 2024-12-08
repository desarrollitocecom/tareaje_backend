const { getRangosHorariosHora } = require('../controllers/rangohorarioController');
const { findEmpleado } = require('../controllers/empleadoController');
const { getProtocols } = require('../controllers/axxonController');
const { createAsistencia } = require('../controllers/asistenciaController');

// Obtener los ids_funcion y el id_turno de Rangos de Horario por hora :
const obtenerRangosHorario = async (hora) => {
    
    try {
        const rangos = await getRangosHorariosHora(hora);
        if (!rangos) return [];
        const id_turno = rangos[0].id_turno;
        const ids_funcion = [];
        rangos.forEach(r => {
            ids_funcion.push(r.id_funcion);
        });
        const horario = { ids_funcion, id_turno };
        return horario;

    } catch (error) {
        console.error(`Error al obtener los rangos de horarios a las ${hora}:`, error);
        return false;
    }
};

// Crear la asistencia (ALGORITMO DE ASISTENCIA) :
const createAsistencias = async (dia, hora) => {
    
    try {
        // Obtener horario, empleados y protocols correspondientes :
        const horario = await obtenerRangosHorario(hora);
        if (horario) return null;
        const { ids_funcion, id_turno } = horario;
        const empleados = await findEmpleado(ids_funcion, id_turno);
        const protocols = await getProtocols(dia, hora);

        // Realizar el match entre empleados y protocols (ASISTENCIA) :
        empleados.forEach(async empleado => {

            const match = protocols.find(protocol =>
                protocol.dni === empleado.dni &&
                protocol.id_funcion === empleado.id_funcion &&
                protocol.id_turno === empleado.id_turno
            );

            if (match) {
                empleado.state = true;
                await createAsistencia(dia, match.hora, 'A', empleado.id, match.foto);
            }
        });

    } catch (error) {
        console.error(`Error al crear las asistencias a las ${hora}:06:00`);
        return false;
    }
}

module.exports = {
    createAsistencias
};