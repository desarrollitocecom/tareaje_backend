const cron = require('node-cron');
const { createAsistencias } = require('../utils/asistenciaAlgorithm');

const configurarCronJobs = async () => {

    const minutos = ['06'];
    const dia = new Date();
    const hora = dia.getHours();
    const diaString = dia.toISOString().split('T')[0];
    
    minutos.forEach(minute => {
        cron.schedule(`${minute} * * * *`, async () => {
            console.log(`Ejecutando algoritmo de asistencia para el día ${diaString} a la hora ${hora}:${minute}:06`);

            try {
                const create = await createAsistencias(diaString, hora);
                if (!create) console.warn(`No se pudo crear las asistencias para las ${hora}:${minute}:06`);
                else console.log(`Algoritmo de asistencia ejecutado con éxito para las ${hora}:${minute}:06`);

            } catch (error) {
                console.error(`Error al ejecutar createAsistenciasRango para las ${hora}:${minute}:`, error);
            }
        });
    });
};

module.exports = configurarCronJobs;