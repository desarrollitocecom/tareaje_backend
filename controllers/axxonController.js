const axios = require('axios');

const { AXXON_URL }= process.env; // URL base de la API

// CRUD URLs :
const urlCreate = `${AXXON_URL}/firserver/CreatePerson`;
const urlRead = `${AXXON_URL}/firserver/ReadPersons`;
const urlDelete = `${AXXON_URL}/firserver/DeletePersons`;

// Protocols y FindFaces URLs :
const urlProtocols = `${AXXON_URL}/firserver/GetProtocols`;
const urlFindFaces = `${AXXON_URL}/firserver/FindFaces`;

// Create Person en la Base de Datos de Axxon (HANDLER PROVISIONAL) :
const createPerson = async (nombres, apellidos, dni, funcion, turno, foto) => {

    if (!nombres) {
        console.warn('El parámetro NOMBRES es requerido...');
        return false;
    }
    if (!apellidos) {
        console.warn('El parámetro APELLIDOS es requerido...');
        return false;
    }
    if (!dni) {
        console.warn('El parámetro DNI es requerido...');
        return false;
    }
    if (!funcion) {
        console.warn('El parámetro FUNCIÓN es requerido...');
        return false;
    }
    if (!turno) {
        console.warn('El parámetro TURNO es requerido...');
        return false;
    }
    if (!foto) {
        console.warn('El parámetro FOTO es requerido...');
        return false;
    }

    // Consulta formato JSON :
    const consulta = {
        "server_id": "1",
        "objectType": "PERSON",
        "id": "", // Se genera automáticamente
        "name": nombres,
        "surname": apellidos,
        "patronymic": dni,
        "department": funcion,
        "comment": turno,
        "createPersonInIntellect": 1,
        "image": foto, // Base 64
        "fir": ""
    };

    try {
        const response = await axios.post(urlCreate, consulta);
        const status = response.data.Status;
        if (status === "SUCCESS") {
            console.log(`Usuario ${dni} creado con éxito...`);
            return true;
        }
        else {
            console.warn(`No se pudo crear al usuario ${dni}...`);
            return false;
        }

    } catch (error) {
        return false;
    }
};

// Read Person en la Base de Datos de Axxon (HANDLER PROVISIONAL):
const readPerson = async () => {

    // Consulta formato JSON :
    const consulta = {
        "server_id": "1",
        "objectType": "PERSON",
        "id": [],
        "page": 1,
        "pageSize": 5000
    };

    try {
        const datosPersonalAxxon = [];
        const response = await axios.post(urlRead, consulta);
        const data = response.data.PersonList;
        data.forEach(person => {
            if (person) {
                const id = person.Id;
                const dni = person.Patronymic;
                const apellidos = person.Surname;
                const personInfo = { id, dni, apellidos };
                datosPersonalAxxon.push(personInfo);
            }
        });
        return datosPersonalAxxon;

    } catch (error) {
        console.error('Error al consulta la API ReadPerson: ', error);
        return false;
    }
};

// Delete Person en la Base de Datos de Axxon (HANDLER PROVISIONAL) :
const deletePerson = async (dni) => {

    if (!dni) {
        console.warn('El parámetro DNI KEY es obligatorio ...');
        return false;
    }
    if (dni.length !== 8) {
        console.warn('El DNI debe tener 8 digitos...');
        return false;
    }

    // Obtener el id del empleado por medio del DNI :
    const id = await getEmpleadoId(dni);
    if (!id) return false;

    // Consulta formato JSON :
    const consulta = {
        "server_id": "1",
        "id": [id]
    };

    try {
        const response = await axios.post(urlDelete, consulta);
        const status = response.data.Status;
        if (status === "SUCCESS") {
            console.log('Usuario eliminado con éxito...');
            return true;
        }
        else {
            console.warn('No se pudo eliminar al usuario...');
            return false;
        }

    } catch (error) {
        console.error('Error al consulta la API DeletePerson: ', error);
        return false;
    }
}

// Obtener el Id de una persona de la Base de Datos de Axxon (HANDLER PROVISIONAL):
const getEmpleadoId = async (dni) => {

    if (!dni) {
        console.warn('El parámetro es requerido...');
        return false;
    }
    if (dni.length !== 8) {
        console.warn('El DNI necesariamente debe tener 8 digitos');
        return false;
    }

    // Consulta Read Person para determinar el Id :
    try {
        const dataAxxon = await readPerson();
        if (!dataAxxon) {
            console.warn('No se pudo obtener la Base de Datos de Axxon');
            return false;
        }

        const persona = dataAxxon.find(persona => persona.dni === dni);
        if (!persona) {
            console.warn('La persona no está registrada en la Base de Datos de Axxon...');
            return false;
        }
        return persona.id;

    } catch (error) {
        return false;
    }
};

// Obtener la Foto de la persona reconocida de Protocols Axxon (HANDLER NECESARIO) :
const getPhotoId = async (photo_id) => {

    // El URL en esta ocasión se maneja dentro de la función :
    try {
        const response = await axios.get(`${AXXON_URL}/firserver/GetImage/1/${photo_id}`, { responseType: 'arraybuffer' });
        return response || null;

    } catch (error) {
        return false;
    }
};

// Obtener los datos de una persona si la foto es reconocida (HANDLER NECESARIO) :
const searchByFace = async (foto) => {

    if (!foto) {
        console.error('El parámetro FOTO es obligatorio...');
        return false;
    }

    // Consulta formato JSON :
    const consulta = {
        "server_id": "1",
        "findPersons": 1,
        "image": foto
    };

    try {
        const response = await axios.post(urlFindFaces, consulta);
        if(response.data.Status && response.data.Status === 'SERVER_NOT_READY') {
            const error = new Error('Lo sentimos, parece que estamos teniendo algunos problemas técnicos en este momento');
            error.statusCode = 500; 
            throw error;

        }

        else if(response.data.FaceList.length === 0) {
            const error = new Error('No se ha detectado ninguna persona. Por favor, enfoque a la persona.');
            error.statusCode = 400;
            throw error;
        }

        const findface = response.data.FaceList[0].PersonList[0];
        const nombres = findface.Name;
        const apellidos = findface.Surname;
        const dni = findface.Patronymic;
        const cargo = findface.Department;
        const turno = findface.Comment;
        const personInfo = { nombres, apellidos, dni, cargo, turno };
        const similitud = findface.Sim;
        if (parseFloat(similitud) < 0.99) {
            console.error('La persona no ha sido reconocida...');
            const error = new Error('No se ha reconocido a la persona...');
            error.statusCode = 401;
            throw error;
        }
        return personInfo;

    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error(`Error al consultar la API: ${error.message}`);
        throw { message: error.message, statusCode };
    }
};

// Obtener los datos de las personas que hayan sido reconocidas en un rango (HANDLER PROVISIONAL) :
const getProtocols = async (fecha, hora) => {

    if (!fecha) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
    if (isNaN(hora)) return false;

    const nextDia = new Date(fecha);
    nextDia.setDate(nextDia.getDate() + 1);
    const nextDay = nextDia.toISOString().split('T')[0];
    const formatInicio = ':06:00.000';
    const formatFinal = ':05:59.999';
    let firstInicio, firstFinal;

    if (hora <= 4) {
        firstInicio = `${fecha}T0${hora + 3}`;
        firstFinal = `${fecha}T0${hora + 5}`;
    }
    else if (hora <= 6) {
        firstInicio = `${fecha}T0${hora + 3}`;
        firstFinal = `${fecha}T${hora + 5}`;
    }
    else if (hora <= 18) {
        firstInicio = `${fecha}T${hora + 3}`;
        firstFinal = `${fecha}T${hora + 5}`;
    }
    else if (hora <= 20) {
        firstInicio = `${fecha}T${hora + 3}`;
        firstFinal = `${nextDay}T0${hora - 19}`;
    }
    else {
        firstInicio = `${nextDay}T0${hora - 21}`;
        firstFinal = `${nextDay}T0${hora - 19}`;
    }

    const inicio = firstInicio + formatInicio;
    const final = firstFinal + formatFinal;

    // Consulta formato JSON :
    const consulta = {
        "server_id": "1",
        "onlineRefresh": 1,
        "dateTimeFrom": inicio,
        "dateTimeTo": final,
        "pageSize": 20000,
        "sim_min": 1
    }

    // Definición del Map: DNI - Fecha - Hora - Id Foto - Id Función - Id Turno :
    const uniqueAsistentes = new Map();

    // Extracción de información por consulta :
    try {
        const response = await axios.post(urlProtocols, consulta);
        if (!response) return [];
        const protocols = response.data.Protocols;
        protocols.forEach(protocol => {

            if (protocol.Hits && protocol.Hits.length > 0) {
                const foto = protocol.id;
                const dni = protocol.Hits[0].patronymic;
                const funcion = protocol.Hits[0].department;
                const turno = protocol.Hits[0].comment;
                const horaProtocol = protocol.timestamp.split('T')[1].split('.')[0];
                const lugar = protocol.camera_name;

                const [hh, mm, ss] = horaProtocol.split(':');
                const numH = Number(hh);
                const newH = (numH >= 5) ? (numH - 5) : (numH + 19);
                const strH = (newH > 9) ? `${newH}` : `0${newH}`;
                const hora = `${strH}:${mm}:${ss}`;

                const id_funcion = parseInt(funcion) || null;
                const id_turno = parseInt(turno) || null;
                const personInfo = { dni, fecha, hora, foto, id_funcion, id_turno, lugar };

                // Si el DNI ya existe en el Map, se compara la hora y se queda con la más temprana :
                if (!uniqueAsistentes.has(dni)) {
                    uniqueAsistentes.set(dni, personInfo);  // Si no existe, se agrega
                } else {
                    const existingPerson = uniqueAsistentes.get(dni);
                    if (new Date('1970-01-01T' + personInfo.hora) < new Date('1970-01-01T' + existingPerson.hora)) {
                        uniqueAsistentes.set(dni, personInfo);  // Si la nueva hora es más temprana, se actualiza el registro
                    }
                }
            }
        });

        // Convertir el Map a un array para devolverlo :
        const result = Array.from(uniqueAsistentes.values());
        return result || [];
    }
    catch (error) {
        console.error('Error al consulta la API Protocols: ', error);
        return false;
    }
};

module.exports = {
    createPerson,
    readPerson,
    deletePerson,
    getEmpleadoId,
    getPhotoId,
    searchByFace,
    getProtocols
};
