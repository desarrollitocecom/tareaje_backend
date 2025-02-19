const { getHorariosHora } = require('../controllers/horarioController');
const { findEmpleado } = require('../controllers/empleadoController');
const { getProtocols } = require('../controllers/axxonController');
const { getFeriadoNacional, getFeriadoCompensado } = require('../controllers/feriadoController');
const { rotativoEmpleado } = require('../controllers/empleadoController');

const {
    validateAsistencia,
    createAsistencia,
    updateAsistencia
} = require('../controllers/asistenciaController');

// Crear la asistencia (ALGORITMO DE ASISTENCIA) :
const createAsistencias = async (dia, hora, minute) => {
    
    try {
        // Obtener las tardanzas (Lugar de trabajo ==> CECOM):
        if (minute === 16) {

            const protocols_tardanza = await getProtocols(dia, hora + 2);
            const horario_tardanza = await getHorariosHora(hora);
            if (!horario_tardanza || horario_tardanza.length === 0) return null;
            const { ids_subgerencia, id_turno, ids_area } = horario_tardanza;
            const empleados_tardanza = await findEmpleado(ids_subgerencia, id_turno, ids_area);
            const empleados_cecom = empleados_tardanza.filter(e => [5,7,8,14,15,17,24,25,26,27,28,31,36,41,43,48,52,54,58].includes(e.id_lugar_trabajo));

            // Crear la tardanza siguiente el flujo correspondiente :
            for (const empleado of empleados_cecom) {
                
                let tardanza;
                const match = (protocols_tardanza.length > 0) ? protocols_tardanza.find(protocol => protocol.dni === empleado.dni) : false;
                const response = await validateAsistencia(dia, empleado.id);
                console.log(response);

                if (match) {
                    if (!response) tardanza = await createAsistencia(dia, match.hora, 'T', empleado.id, match.foto, true);
                    else if (!response.estado) tardanza = await updateAsistencia(response.id, dia, match.hora, 'T', empleado.id, match.foto, true);
                    else if (response.estado === 'F') tardanza = await updateAsistencia(response.id, dia, match.hora, 'T', empleado.id, match.foto, true);
                    else tardanza = await updateAsistencia(response.id, dia, match.hora, response.estado, empleado.id, match.foto, true);
                }
                if (!tardanza) console.warn(`Tardanza no creada para el empleado con ID ${empleado.id}`);
            }
            return true;
        }

        // Obtener todos los registros de Protocols en una hora determinada :
        const protocols = await getProtocols(dia, hora);
        const horaStr = (hora < 10) ? `0${hora}` : `${hora}`;
        const fecha = new Date(dia);
        
        // Obtener los ids de los empleados para un feriado determinado :
        const e_feriado_nacional = await getFeriadoNacional(dia);
        const e_feriado_compensado = await getFeriadoCompensado(dia);

        // Obtener asistencias de rotativos :
        if (hora >= 5 || hora <= 18) {

            let asistenciaRot;
            const rotativos = await rotativoEmpleado();
            if (rotativos || rotativos.length > 0) {
                for (const rotativo of rotativos) {

                    const match1 = (protocols.length > 0) ? protocols.find(protocol => protocol.dni === rotativo.dni) : false;
                    const response = await validateAsistencia(dia, rotativo.id);
                    if (match1) {
                        if (!response) asistenciaRot = await createAsistencia(dia, match1.hora, 'A', rotativo.id, match1.foto);
                        else if (response.estado === 'A') continue;
                        else if (!response.estado) asistenciaRot = await updateAsistencia(response.id, dia, match1.hora, 'A', rotativo.id, match1.foto);
                        else asistenciaRot = await updateAsistencia(response.id, dia, match1.hora, response.estado, rotativo.id, match1.foto, true);
                        if (!asistenciaRot) console.warn(`Asistencia no creada para el empleado rotativo con ID ${rotativo.id}`);
                    }
    
                    if (hora === 18 && response.estado !== 'A') {
                        const match2 = e_feriado_nacional;
                        const match3 = (e_feriado_compensado.length > 0) ? e_feriado_compensado.includes(rotativo.id) : false;
                        if (match2) {
                            if (!response) asistenciaRot = await createAsistencia(dia, `${horaStr}:00:00`, 'DF', rotativo.id, 'Sin foto');
                            else if (!response.estado) asistenciaRot = await updateAsistencia(response.id, dia, response.hora, response.estado, empleado.id, response.photo_id, response.evidencia);
                            else asistenciaRot = await updateAsistencia(response.id, dia, `${horaStr}:00:00`, 'DF', rotativo.id, 'Sin foto');
                        }
                        else if (match3) {
                            if (!response) asistenciaRot = await createAsistencia(dia, `${horaStr}:06:00`, 'NA', rotativo.id, 'Sin foto');
                            else if (!response.estado) asistenciaRot = await updateAsistencia(response.id, dia, response.hora, response.estado, empleado.id, response.photo_id, response.evidencia);
                            else asistenciaRot = await updateAsistencia(response.id, dia, `${horaStr}:06:00`, 'NA', rotativo.id, 'Sin foto');
                        }
                        else if (rotativo.id_area === 2 && fecha.getDay() === 0) continue;
                        else {
                            if (!response) asistenciaRot = await createAsistencia(dia, `${horaStr}:06:00`, 'F', rotativo.id, 'Sin foto');
                            else if (!response.estado) asistenciaRot = await updateAsistencia(response.id, dia, response.hora, response.estado, empleado.id, response.photo_id, response.evidencia);
                            else asistenciaRot = await updateAsistencia(response.id, dia, `${horaStr}:06:00`, 'F', rotativo.id, 'Sin foto');
                        }
                    }
                }
            }
        }

        // Obtener horario y empleados correspondientes :
        const horario = await getHorariosHora(hora);
        if (!horario || horario.length === 0) return null;
        const { ids_subgerencia, id_turno, ids_area } = horario;
        const empleados = await findEmpleado(ids_subgerencia, id_turno, ids_area);

        // Crear la asistencia siguiente el flujo correspondiente :
        for (const empleado of empleados) {
            
            let asistencia;
            const match1 = (protocols.length > 0) ? protocols.find(protocol => protocol.dni === empleado.dni) : false;
            const match2 = e_feriado_nacional;
            const match3 = (e_feriado_compensado.length > 0) ? e_feriado_compensado.includes(empleado.id) : false;

            const response = await validateAsistencia(dia, empleado.id);

            if (match1) {
                if (!response) asistencia = await createAsistencia(dia, match1.hora, 'A', empleado.id, match1.foto, true);
                else if (!response.estado) asistencia = await updateAsistencia(response.id, dia, match1.hora, 'A', empleado.id, match1.foto, true);
                else asistencia = await updateAsistencia(response.id, dia, match1.hora, response.estado, empleado.id, match1.foto, true);
            }
            else if (match2) {
                if (!response) asistencia = await createAsistencia(dia, `${horaStr}:00:00`, 'DF', empleado.id, 'Sin foto');
                else if (!response.estado) asistencia = await updateAsistencia(response.id, dia, response.hora, response.estado, empleado.id, response.photo_id, response.evidencia);
                else asistencia = await updateAsistencia(response.id, dia, `${horaStr}:00:00`, 'DF', empleado.id, 'Sin foto');
            }
            else if (match3) {
                if (!response) asistencia = await createAsistencia(dia, `${horaStr}:06:00`, 'NA', empleado.id, 'Sin foto');
                else if (!response.estado) asistencia = await updateAsistencia(response.id, dia, response.hora, response.estado, empleado.id, response.photo_id, response.evidencia);
                else asistencia = await updateAsistencia(response.id, dia, `${horaStr}:06:00`, 'NA', empleado.id, 'Sin foto');
            }
            else {
                if (!response) asistencia = await createAsistencia(dia, `${horaStr}:06:00`, 'F', empleado.id, 'Sin foto');
                else if (!response.estado) asistencia = await updateAsistencia(response.id, dia, response.hora, response.estado, empleado.id, response.photo_id, response.evidencia);
                else asistencia = await updateAsistencia(response.id, dia, `${horaStr}:06:00`, 'F', empleado.id, 'Sin foto');
            }
            if (!asistencia) console.warn(`Asistencia no creada para el empleado con ID ${empleado.id}`);
        }
        return true;

    } catch (error) {
        console.error({
            message: `Error al crear las asistencias a las ${hora}:06:00`,
            error: error
        });
        return false;
    }
};

module.exports = { createAsistencias };
