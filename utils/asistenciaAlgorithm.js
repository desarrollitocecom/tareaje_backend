const { getProtocols } = require('../controllers/axxonController');
const { getAllRangosHorariosTotal } = require('../controllers/rangohorarioController');
const { createAsistencia } = require('../controllers/asistenciaController');

// Determinación si la hora corresponde a la petición de CronJobs :
const confirmarHoraCJ = async (hora) => {
    try{
        const rangos = await getAllRangosHorariosTotal();
        const ingreso = [...new Set(rangos.map(rango => rango.inicio))];
        if(!ingreso.includes(hora)) return false;
        else return hora;
    } catch (error) {
        console.error('Error al obtener los rangos de horarios en general:', error);
        return false;
    }
};

// Determinación del rango para la consulta a Axxon :
const determinarRango = async (dia) => {

    const nextDia = new Date(dia);
    nextDia.setDate(nextDia.getDate() + 1);
    nextDia = nextDia.toISOString().split('T')[0];
}

module.exports = {
    confirmarHoraCJ,
    determinarRango
}