const cron = require('node-cron');
const { createAsistenciasRango } = require('../utils/asistenciaAlgorithm');

const minutos = ['06'];

function configurarCronJobs() {
    const dia = new Date();
    const hora = dia.getHours;
    const diaString = dia.toISOString().split('T')[0];
    minutos.forEach(minute => {
        cron.schedule(`${minute} * * * *`, () => { // `*` en la posición de hora significa que se ejecuta cada hora
            createAsistenciasRango(diaString, hora);
        });
    });
}

module.exports = { configurarCronJobs };