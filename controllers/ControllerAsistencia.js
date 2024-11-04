const { consultAPI } = require('../services/apiService');

// >>> LISTADO DE FUNCIONES DE CARGO :
const cargoAdmin = ['ADMINISTRATIVO',
    'ALMACEN',
    'APOYO ADM-INFORMES',
    'APOYO ADMINISTRATIVO',
    'ASISTENTE ADMINISTRATIVO',
    'ASISTENTE CAMIONETAS',
    'ASISTENTE PERSONAL',
    'ASISTENTE JEFATURA',
    'ASISTENTE MOTOS',
    'ASISTENTE RADIOS',
    'ASISTENTE SOCIAL',
    'AUX MECANICO',
    'BRIGADA CANINA',
    'CONDUCTOR BUS',
    'CAMION',
    'CAPACITADOR',
    'CEPLAN',
    'CHOFER DE CAMIONETA',
    'CHOFER DE CUATRIMOTO',
    'CHOFER MOTORIZADO',
    'CODISEC',
    'COORDINADOR DELTA',
    'COORDINADOR SERENAZGO',
    'COORDINADOR TI',
    'COYA',
    'CREADOR AUDIOVISUAL',
    'DELTA',
    'DIJITALIZADOR',
    'ELECTRICISTA',
    'ENCARGADO DEL AREA',
    'ENCARGADO DE PERSONAL',
    'ENCARGADO DE TAREAJE',
    'ESPECIALISTA TAREAJE',
    'FENIX',
    'GESTOR DE CAMARAS',
    'JEFE CENTRAL',
    'JEFE OPERACIONES',
    'JEFE PLANEAMIENTO',
    'JEFE PLANTA',
    'JEFE SERVICIO',
    'LIMPIEZA',
    'LOGISTICA',
    'NOTIFICADOR',
    'OPERADOR DE CAMARA',
    'PAGO LOCADORES',
    'PLANTA',
    'PROGRAMADOR',
    'PROMOTOR CODISEC',
    'PUERTA PEATONAL',
    'PUERTA VEHICULAR',
    'RECEPCION',
    'RESCATE',
    'SECRETARIA',
    'SEGURIDAD PRIVADA',
    'SERENO A PIE',
    'SISCOP',
    'SOPORTE',
    'SUB GERENTE',
    'SUPERVISOR CAMPO',
    'SUPERVISOR BRIGADA CANINA',
    'SUPERVISOR CECOM',
    'SUPERVISOR COYA',
    'SUPERVISOR DELTA',
    'SUPERVISOR META',
    'SUPERVISOR RESCATE',
    'VETERINARIO',
    'VIGILANTE SEGURO',
    'CHOFER DE CAMIONETA META',
    'OPERADOR META'];

async function asistencia(hoy) {
    const hora = hoy.getHours();
    const consulta = await consultAPI(hoy);
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
    }

    filtroAsistencia.forEach(f => {
        const { dni, fecha, hora, foto } = f;
        pushAsistencia.push({ dni, fecha, hora, foto });
    });

    return pushAsistencia;
}

module.exports = { asistencia };
