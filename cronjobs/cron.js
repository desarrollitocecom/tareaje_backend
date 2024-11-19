const cron = require('node-cron');
const { createAsistenciasRango } = require('../utils/asistenciaAlgorithm');

const configurarCronJobs = async () => {

    const minutos = ['06'];
    const dia = new Date();
    const hora = dia.getHours();
    const diaString = dia.toISOString().split('T')[0];
    
    minutos.forEach(minute => {
        cron.schedule(`${minute} * * * *`, async () => { 
            console.log(`Ejecutando createAsistenciasRango para el día ${diaString} a la hora ${hora}:${minute}`);
            await createAsistenciasRango(diaString, hora)
                .then(() => {
                    console.log(`createAsistenciasRango ejecutado con éxito para las ${hora}:${minute}`);
                })
                .catch(error => {
                    console.error(`Error al ejecutar createAsistenciasRango para las ${hora}:${minute}`, error);
                });
        });
    });
};

module.exports = configurarCronJobs;