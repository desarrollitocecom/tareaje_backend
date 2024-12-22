const { getRangosHorariosHora } = require('../controllers/rangohorarioController');
const { findEmpleado } = require('../controllers/empleadoController');
const { getProtocols } = require('../controllers/axxonController');
const { createAsistencia } = require('../controllers/asistenciaController');
const { getVacacionDiaria } = require('../controllers/vacacionesController');
const { getDescansosDiario } = require('../controllers/descansoController');
const { getFeriadoDiario } = require('../controllers/feriadoController');

// Crear la asistencia (ALGORITMO DE ASISTENCIA) :
const createAsistencias = async (dia, hora) => {
    
    try {
        // Obtener horario, empleados y protocols correspondientes :
        const horaStr = (hora < 10) ? `0${hora}` : `${hora}`;
        const horario = await getRangosHorariosHora(hora);
        if (!horario || horario.length === 0) return null;
        const { ids_funcion, id_turno } = horario;
        const empleados = await findEmpleado(ids_funcion, id_turno);
        const protocols = await getProtocols(dia, hora);

        // Obtener los ids de los empleados que presenten vacaciones, descansos o feriado :
        const e_vacaciones = await getVacacionDiaria(dia);
        const e_descansos = await getDescansosDiario(dia);
        const e_feriado = await getFeriadoDiario(dia);

        // Crear la asistencia siguiente el flujo correspondiente :
        for (const empleado of empleados) {
            
            let match1 = false;
            if (protocols.length > 0) {
                match1 = protocols.find(protocol =>
                    protocol.dni === empleado.dni &&
                    protocol.id_funcion === empleado.id_funcion &&
                    protocol.id_turno === empleado.id_turno
                );
            }

            const match2 = (e_vacaciones.length > 0) ? e_vacaciones.includes(empleado.id) : false;
            const match3 = (e_descansos.length > 0) ? e_descansos.find(e => e.id_empleado === empleado.id) : false;
            const match4 = (e_feriado.length > 0) ? e_feriado.includes(empleado.id) : false;

            if (match1) await createAsistencia(dia, match1.hora, 'A', empleado.id, match1.foto);
            else if (match2) await createAsistencia(dia, `${horaStr}:00:00`, 'V', empleado.id, 'Sin foto');
            else if (match3) await createAsistencia(dia, `${horaStr}:00:00`, match3.tipo, empleado.id, 'Sin foto');
            else if (match4) await createAsistencia(dia, `${horaStr}:00:00`, 'DF', empleado.id, 'Sin foto');
            else createAsistencia(dia, `${horaStr}:06:00`, 'F', empleado.id, 'Sin foto');
        }

    } catch (error) {
        console.error(`Error al crear las asistencias a las ${hora}:06:00`, error);
        return false;
    }
}

module.exports = {
    createAsistencias
};