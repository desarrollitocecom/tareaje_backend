const axios = require('axios');
const { consultarRango } = require('../utils/rangos');
const url = 'http://192.168.13.80:10000/firserver/GetProtocols';

async function consultAPI(hoy) {
    const rango = consultarRango(hoy);
    const fecha = hoy.toISOString().split('T')[0];
    console.log(`Ejecutando el registro el: ${fecha}`);
    console.log(`Rango de Asistencia: ${rango[0].split('T')[1]} - ${rango[1].split('T')[1]}`);

    const consulta = {
        "server_id": "1",
        "onlineRefresh": 1,
        "genders": [0, 1, 2],
        "dateTimeFrom": rango[0],
        "dateTimeTo": rango[1],
        "cameraIds": ["1"],
        "minAge": 0,
        "maxAge": 1000,
        "page": 1,
        "pageSize": 1500,
        "sim_min": 1
    };

    const uniqueAsistentes = new Map();

    try {
        const response = await axios.post(url, consulta);
        const protocols = response.data.Protocols;
        protocols.forEach(protocol => {
            if (protocol.Hits && protocol.Hits.length > 0) {
                const { id: foto, patronymic: dni, department: cargo, comment: turno } = protocol.Hits[0];
                const hora = protocol.timestamp.split('T')[1].split('.')[0];
                const personInfo = { dni, fecha, hora, foto, cargo, turno };

                if (!uniqueAsistentes.has(dni)) {
                    uniqueAsistentes.set(dni, personInfo);
                } else {
                    const existingPerson = uniqueAsistentes.get(dni);
                    if (new Date('1970-01-01T' + personInfo.hora) < new Date('1970-01-01T' + existingPerson.hora)) {
                        uniqueAsistentes.set(dni, personInfo);
                    }
                }
            }
        });

        return Array.from(uniqueAsistentes.values());
    } catch (error) {
        console.error('Error al consultar la API...', error);
    }
}

module.exports = { consultAPI };
