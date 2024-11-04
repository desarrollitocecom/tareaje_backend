const cron = require('node-cron');
const { registroAsistencia } = require('../controllers/asistenciaController');

const horas = ['07:06', '08:06', '15:06', '19:06', '23:06'];

function configurarCronJobs() {
    horas.forEach(hora => {
        const [hour, minute] = hora.split(':');
        cron.schedule(`${minute} ${hour} * * *`, () => {
            registroAsistencia();
        });
    });
}

module.exports = { configurarCronJobs };
