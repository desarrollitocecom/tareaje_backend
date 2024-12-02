const { Asistencia, RangoHorario, Descanso, Feriado, Vacacion } = require('../db_connection');
const { getProtocols } = require('../controllers/axxonController');
const { getEmpleadoIdDniByCargoTurno } = require('../controllers/empleadoController');
const { getAllRangosHorariosTotal, getCargoTurnoIdsByInicio } = require('../controllers/rangohorarioController');
const { createAsistencia } = require('../controllers/asistenciaController');

// Confirmación si la hora corresponde a la petición de CronJobs :
const confirmarHoraCJ = async (hora) => {
    
    try{
        const rangos = await getAllRangosHorariosTotal();
        const ingreso = [...new Set(rangos.map(rango => rango.inicio.getHour()))];
        if(!ingreso.includes(hora)){
            console.log('En esta hora no se toma asistencia...');
            return false;
        }
        else{
            console.log(`Se procede a tomar la asistencia de las ${hora}:06:00`);
            return true;
        }
    } catch (error) {
        console.error('Error al obtener los rangos de horarios en general:', error);
        return false;
    }
};

// Determinación del rango para la consulta a Axxon :
const determinarRango = (dia, hora) => {

    const nextDia = new Date(dia);
    nextDia.setDate(nextDia.getDate() + 1);
    const diaSiguiente = nextDia.toISOString().split('T')[0];

    if (hora < 5) return [`${dia}T0${hora + 3}:00:00.000`, `${dia}T0${hora + 5}:05:59.999`];
    else if(hora < 7) return [`${dia}T0${hora + 3}:00:00.000`, `${dia}T${hora + 5}:05:59.999`];
    else if(hora < 19) return [`${dia}T${hora + 3}:00:00.000`, `${dia}T${hora + 5}:05:59.999`];
    else if(hora < 21) return [`${dia}T${hora + 3}:00:00.000`, `${diaSiguiente}T0${hora - 19}:05:59.999`];
    else return [`${diaSiguiente}T0${hora - 19}:00:00.000`, `${diaSiguiente}T0${hora - 19}:05:59.999`];
};

// Consulta a Axxon GetProtocols para el rango determinado :
const consultaAxxonProtocols = async (dia, hora) => {
    
    const result = confirmarHoraCJ(hora);
    if(result){
        const rango = determinarRango(dia, hora);
        const inicio = rango[0];
        const final = rango[1];
        try {
            const consulta = await getProtocols(inicio, final);
            return consulta;
        } catch (error) {
            console.error('Error al consultar Axxon Protocols...');
            return null;
        }
    }
    else{
        return null;
    }
};

// Asociar la consulta de GetProtocols con RangoHorarios y Empleados :
const registrarAsistenciaFalta = async (dia, hora) => {
    
    try {
        const consulta = await consultaAxxonProtocols(dia, hora);
        const cargosTurnos = await getCargoTurnoIdsByInicio(hora);
        const dnis = [];
        cargosTurnos.forEach(async ct => {
            const totalCargoTurnoDNI = await getEmpleadoIdDniByCargoTurno(ct.cargoId, ct.turnoId);
            totalCargoTurnoDNI.forEach(dni => {
                dnis.push(dni);
            });
        });
        consulta.forEach(consult => {
            if(dnis.includes(consult.dni)) consult.estado = 'A';
            else consult.estado = 'F';
        });
        return consulta;
    } catch (error) {
        console.error('Error en el registro de asistencia y falta...');
        return null;
    }
}

// Crear la asistencia (SOLO EL ALGORITMO LO PUDE HACER) :
const createAsistenciasRango = async (dia, hora) => {
    
    try {
        const asistencias = await registrarAsistenciaFalta(dia, hora);
        const { fecha, hora, estado, id_empleado, photo_id } = asistencias;
        const registro = await createAsistencia(fecha, hora, estado, id_empleado, photo_id);
        if(registro){
            console.log(`Asistencias creadas y guardadas correctamente a las ${hora}:06:00`);
            return true;
        }
        else{
            console.error(`Las asistencias no se guardaron a las ${hora}:06:00`);
            return false;
        }
    } catch (error) {
        console.error(`Error al crear las asistencias a las ${hora}:06:00`);
        return false;
    }
}

module.exports = {
    createAsistenciasRango
};