const { getHorariosHora } = require('../controllers/horarioController');
const { findEmpleado } = require('../controllers/empleadoController');
const { getProtocols } = require('../controllers/axxonController');
const { createAsistencia } = require('../controllers/asistenciaController');
const { getVacacionDiaria } = require('../controllers/vacacionesController');
const { getDescansosDiario } = require('../controllers/descansoController');
const { getFeriadoDiario } = require('../controllers/feriadoController');
const { rotativoEmpleado } = require('../controllers/empleadoController');

// Crear la asistencia (ALGORITMO DE ASISTENCIA) :
const createAsistencias = async (dia, hora) => {
    
    try {
        // Obtener todos los registros de Protocols en una hora determinada :
        const protocols = await getProtocols(dia, hora);

        // Obtener asistencias de rotativos :
        if (hora > 6 || hora < 17) {
            let asistenciaRot;
            const rotativos = await rotativoEmpleado();
            if (!rotativos || rotativos.length === 0) return;
            const asistenciaRotativa = [];
        
            for (const rotativo of rotativos) {
                const match = (protocols.length > 0) ? protocols.find(protocol => protocol.dni === rotativo.dni) : false;
                if (match) {
                    asistenciaRot = await createAsistencia(dia, match.hora, 'A', rotativo.id, match.foto);
                    if (!asistenciaRot) console.warn(`Asistencia no creada para el empleado con ID ${rotativo.id}`);
                    else if (asistenciaRot === 1) console.warn(`La asistencia ya fue creada para el empleado con ID ${rotativo.id}`);
                    else asistenciaRotativa.push(rotativo.dni);
                }
            }
        
            if (asistenciaRotativa.length > 0) console.log('Asistencias creadas para rotativos:', asistenciaRotativa);
        }

        // Obtener horario, empleados correspondientes :
        const horaStr = (hora < 10) ? `0${hora}` : `${hora}`;
        const horario = await getHorariosHora(hora);
        if (!horario || horario.length === 0) return null;
        const { ids_subgerencia, id_turno, ids_area } = horario;
        const empleados = await findEmpleado(ids_subgerencia, id_turno, ids_area);

        // Obtener los ids de los empleados que presenten vacaciones, descansos o feriado :
        const e_vacaciones = await getVacacionDiaria(dia);
        const e_descansos = await getDescansosDiario(dia);
        const e_feriado = await getFeriadoDiario(dia);

        // Crear la asistencia siguiente el flujo correspondiente :
        for (const empleado of empleados) {
            
            let asistencia;
            const match1 = (protocols.length > 0) ? protocols.find(protocol => protocol.dni === empleado.dni) : false;
            const match2 = (e_vacaciones.length > 0) ? e_vacaciones.includes(empleado.id) : false;
            const match3 = (e_descansos.length > 0) ? e_descansos.find(e => e.id_empleado === empleado.id) : false;
            const match4 = (e_feriado.length > 0) ? e_feriado.includes(empleado.id) : false;

            if (match1) asistencia = await createAsistencia(dia, match1.hora, 'A', empleado.id, match1.foto);
            else if (match2) asistencia = await createAsistencia(dia, `${horaStr}:00:00`, 'V', empleado.id, 'Sin foto');
            else if (match3) asistencia = await createAsistencia(dia, `${horaStr}:00:00`, match3.tipo, empleado.id, 'Sin foto');
            else if (match4) asistencia = await createAsistencia(dia, `${horaStr}:00:00`, 'DF', empleado.id, 'Sin foto');
            else asistencia = await createAsistencia(dia, `${horaStr}:06:00`, 'F', empleado.id, 'Sin foto');

            if (!asistencia) console.warn(`Asistencia no creada para el empleado con ID ${empleado.id}`);
        }
        return true;

    } catch (error) {
        console.error(`Error al crear las asistencias a las ${hora}:06:00`, error);
        return false;
    }
}

module.exports = {
    createAsistencias
};