const cron = require('node-cron');
const { createAsistencias } = require('../utils/asistenciaAlgorithm');

const configurarCronJobs = async () => {
    
    cron.schedule('06 * * * *', async () => {
        await executeWork()
    });

    cron.schedule('16 8 * * *', async () => {
        await executeWork()
    });
};

const executeWork = async () => {

    const ahora = new Date();
    const peruOffset = -5 * 60; // offset de Perú en minutos
    const localOffset = ahora.getTimezoneOffset(); 
    const dia = new Date(ahora.getTime() + (peruOffset - localOffset) * 60000);
    const diaString = dia.toISOString().split('T')[0];
    const hora = ahora.getHours();
    const minute = ahora.getMinutes();
    const horaStr = (hora < 10) ? `0${hora}` : `${hora}`;
    const minuteStr = (minute < 10) ? `0${minute}` : `${minute}`;

    // Cron Job en curso :
    console.log(`Ejecutando algoritmo de asistencia para el día ${diaString} a las ${horaStr}:${minuteStr}:00`);

    try {
        const create = await createAsistencias(diaString, hora, minute);
        if (!create) console.warn(`No se toma asistencia a las ${horaStr}:${minuteStr}:00. Esperar a la siguiente hora...`);
        else console.log(`Algoritmo de asistencia ejecutado con éxito a las ${horaStr}:${minuteStr}:00`);

    } catch (error) {
        console.error(`Error al ejecutar crear asistencias para las ${horaStr}:${minuteStr}:00`, error);
    }
}

module.exports = configurarCronJobs;