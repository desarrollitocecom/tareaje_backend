const { getProtocols } = require('../controllers/axxonController');
const { createAsistencia } = require('../controllers/asistenciaController');

// Rangos definidos de acuerdo a cada turno y a los cargos excepcionales : 
function definirRangos(dia) {
    
    const nextDia = new Date(dia);
    nextDia.setDate(nextDia.getDate() + 1);
    nextDia = nextDia.toISOString().split('T')[0];

    return {
        rangoM: [dia + 'T10:00:00.000', dia + 'T12:05:59.999'],
        rangoT: [dia + 'T18:00:00.000', dia + 'T20:05:59.999'],
        rangoN: [nextDia + 'T02:00:00.000', nextDia + 'T04:05:59.999'],
        rangoDelta: [dia + 'T22:00:00.000', nextDia + 'T00:05:59.999'],
        rangoAdmin: [dia + 'T11:00:00.000', dia + 'T13:05:59.999'],
    };
};

// Consulta del rango según el horario establecido por el Cron Jobs :
function consultarRango(dia) {
    
    const diaStrn = dia.toISOString().split('T')[0];
    const diaHora = dia.getHours();
    const rangos = definirRangos(diaStrn);

    // Consulta el rango determinado :
    switch (diaHora) {
        case 7: return rangos.rangoM;
        case 8: return rangos.rangoAdmin;
        case 15: return rangos.rangoT;
        case 19: return rangos.rangoDelta;
        case 23: return rangos.rangoN;
        default: return 'En este horario no hay consulta...';
    }
};

// Algoritmo para almacenar a las personas registradas por la cámara :
async function asistenciaReconocimiento(dia) {
    
    const rango = consultarRango(dia)
    const hora = hoy.getHours();
    
    try {
        const consulta = await getProtocols(rango);
        const filtroAsistencia = [];
        const pushAsistencia = [];
        
        if(hora === 7){
            consulta.forEach(c => {
                if(!cargoAdmin.includes(c.cargo) && c.turno[0] === 'M') filtroAsistencia.push(c);
            });
        }
        else if(hora === 8){
            consulta.forEach(c => {
                if(cargoAdmin.includes(c.cargo) && c.turno[0] === 'M') filtroAsistencia.push(c);
            });
        }
        else if(hora === 19){
            consulta.forEach(c => {
                if(c.cargo === 'DELTA' && c.turno[0] === 'N') filtroAsistencia.push(c);
            });
        }
        else if(hora === 15){
            consulta.forEach(c => {
                if(c.turno[0] === 'T') filtroAsistencia.push(c);
            });
        }
        else if(hora === 23){
            consulta.forEach(c => {
                if(c.turno[0] === 'N') filtroAsistencia.push(c);
            });
        }
        else{
            console.error('En este horario no hay consulta...');
            return false;
        }
    
        filtroAsistencia.forEach(f => {
            const fecha = f.fecha;
            const hora = f.hora;
            const dni = f.dni;
            const photo_id = f.foto;
            const estado = 'A';
            const asistInfo = {fecha, hora, dni, photo_id, estado};
            pushAsistencia.push(asistInfo);
        });
    
        const registro = await createAsistencia(pushAsistencia);

    } catch (error) {
        console.error('Error en la consulta de Axxon Protocols...');
        return false;
    }
};

module.exports = { registroAsistencia }; 