const axios = require('axios');
const { AXXON_URL } = process.env;

// CRUD URLs :
const urlCreate = `${AXXON_URL}/firserver/CreatePerson`;
const urlUpdate = `${AXXON_URL}/firserver/UpdatePerson`;
const urlRead = `${AXXON_URL}/firserver/ReadPersons`;
const urlDelete = `${AXXON_URL}/firserver/DeletePersons`;

// Protocols y FindFaces URLs :
const urlProtocols = `${AXXON_URL}/firserver/GetProtocols`;
const urlFindFaces = `${AXXON_URL}/firserver/FindFaces`;

// Create Person en la Base de Datos de Axxon (SIN HANDLER):
const createPerson = async (nombres, apellidos, dni, funcion, turno, foto) => {
    
    if(!nombres){
        console.error('El parámetro NOMBRES es requerido...');
        return false;
    }
    if(!apellidos){
        console.error('El parámetro APELLIDOS es requerido...');
        return false;
    }
    if(!dni){
        console.error('El parámetro DNI es requerido...');
        return false;
    }
    if(!funcion){
        console.error('El parámetro FUNCIÓN es requerido...');
        return false;
    }
    if(!turno){
        console.error('El parámetro TURNO es requerido...');
        return false;
    }
    if(!foto){
        console.error('El parámetro FOTO es requerido...');
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
        "department": cargo,
        "comment": turno,
        "createPersonInIntellect": 1,
        "image": foto, // Base 64
        "fir": ""
    };

    try {
        const response = await axios.post(urlCreate, consulta);
        const status = response.data.Status;
        if(status === "SUCCESS"){
            console.log('Usuario creado con éxito...');
            return true;
        }
        else{
            console.warn('No se pudo crear al usuario...');
            return false;
        }
    } catch (error) {
        console.error('Error al consulta la API CreatePerson: ', error);
        return false;
    }
};

// Read Person en la Base de Datos de Axxon (SIN HANDLER):
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
            if(person){
                const id = person.Id;
                const dni = person.Patronymic;
                const apellidos = person.Surname;
                const personInfo = {id, dni, apellidos};
                datosPersonalAxxon.push(personInfo);
            }
        });
        return datosPersonalAxxon;
    } catch (error) {
        console.error('Error al consulta la API ReadPerson: ', error);
        return false;
    }
};

// Update Person en la Base de Datos de Axxon (SIN HANDLER):
const updatePerson = async (nombres = null, apellidos = null, dni, cargo = null, turno = null) => {
    
    if(!dni){
        console.error('El parámetro DNI es obligatorio ...');
        return false;
    }
    if(dni.length !== 8){
        console.error('El DNI debe tener 8 digitos...');
        return false;
    }

    // Consulta getEmpleadoId para determinar el Id y proceder con el update :
    const id = await getEmpleadoId(dni);

    if(id) {
        // Consulta formato JSON :
        const consulta = {
            "server_id": "1",
            "id": id
        };

        if (nombres.lenght > 0) consulta.name = nombres;
        if (apellidos.lenght > 0) consulta.surname = apellidos;
        if (cargo.lenght > 0) consulta.department = cargo;
        if (turno.lenght > 0) consulta.comment = turno;
        
        try {
            const response = await axios.post(urlUpdate, consulta);
            const status = response.data.Status;
            if(status === "SUCCESS"){
                console.log('Usuario actualizado con éxito...');
                return true;
            }
            else{
                console.warn('No se pudo actualizar al usuario...');
                return false;
            }
        } catch (error) {
            console.error('Error al consulta la API UpdatePerson: ', error);
            return false;
        }
    }
    else{
        console.warn('Error al obtener el Id de la persona en Axxon');
        return false;
    }
};

// Delete Person en la Base de Datos de Axxon (SIN HANDLER):
const deletePerson = async (dni) => {

    if(!dni){
        console.error('El parámetro DNI KEY es obligatorio ...');
        return false;
    }
    if(dni.length !== 8){
        console.error('El DNI debe tener 8 digitos...');
        return false;
    }

    // Consulta getEmpleadoId para determinar el Id y proceder con el update :
    const id = await getEmpleadoId(dni);

    if(id) {
        // Consulta formato JSON :
        const consulta = {
        "server_id": "1",
        "id": [id]
        };
        try {
            const response = await axios.post(urlDelete, consulta);
            const status = response.data.Status;
            if(status === "SUCCESS"){
                console.log('Usuario eliminado con éxito...');
                return true;
            }
            else{
                console.warn('No se pudo eliminar al usuario...');
                return false;
            }
        } catch (error) {
            console.error('Error al consulta la API DeletePerson: ', error);
            return false;
        }
    }
    else{
        console.warn('Error al obtener el Id de la persona en Axxon');
        return false;
    }
}

// Obtener el Id de una persona de la Base de Datos de Axxon :
const getEmpleadoId = async (dni) => {
    
    if(!dni){
        console.warn('El parámetro es requerido...');
    }
    if(dni.length !== 8){
        console.warn('El DNI necesariamente debe tener 8 digitos');
    }

    // Consulta Read Person para determinar el Id :
    try {
        const dataAxxon = await readPerson();
        const persona = dataAxxon.find(persona => persona.dni === dni);
        if(persona) return persona.id;
        else{
            console.warn('La persona no está registrada en la Base de Datos de Axxon...');
            return false;
        }
    } catch (error) {
        console.error('Error en la función getEmpleadoId: ', error);
        return false;
    }
};

// Obtener la Foto de la persona reconocida de Protocols Axxon (CON HANDLER) :
const getPhotoId = async (photo_id) => {
    
    // El url en esta ocasión se maneja dentro de la función getPhotoId :
    try {
        const response = await axios.get(`${AXXON_URL}/firserver/GetImage/1/${photo_id}`, { responseType: 'arraybuffer' });
        if(response){
            return response;
        }
        else{
            return null;
        } 
    } catch (error) {
        console.error("Error al obtener la imagen:", error);
        return false;
    }
};

// Obtener los datos de una persona si la foto es reconocida (SIN HANDLER) :
const searchByFace = async (foto) => {

    if(!foto){
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
        const findface = response.data.FaceList[0].PersonList[0];
        const dni = findface.Patronymic;
        const cargo = findface.Department;
        const turno = findface.Comment;
        const personInfo = {dni, cargo, turno};
        const similitud = findface.Sim;
        if(parseFloat(similitud) > 0.99) return personInfo;
        else{
            console.error('La persona no ha sido reconocida...');
            return false;
        }
    } catch (error) {
        console.error('Error al consulta la API: ', error);
        return false;
    }
};

// Obtener los datos de las personas que hayan sido reconocidas en un rango :
const getProtocols = async (inicio, final) => {
    
    if(!inicio) return false;
    if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(inicio)) return false;
    if(!final) return false;
    if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(final)) return false;
        
    // Consulta formato JSON :
    const consulta = {
        "server_id": "1",
        "onlineRefresh": 1,
        "genders": [0, 1, 2],
        "dateTimeFrom": inicio,
        "dateTimeTo": final,
        "cameraIds": ["1"],
        "minAge": 0,
        "maxAge": 1000,
        "page": 1,
        "pageSize": 5000,
        "sim_min": 1
    }

    // Definición del Map: DNI - Fecha - Hora - Id Foto - Cargo - Turno :
    const uniqueAsistentes = new Map();

    // Extracción de información por consulta :
    try{
        const response = await axios.post(urlProtocols, consulta);
        const protocols = response.data.Protocols;
        const fecha = inicio.split('T')[0];
        protocols.forEach(protocol => {
            if(protocol.Hits && protocol.Hits.length > 0){
                const foto = protocol.id;
                const dni = protocol.Hits[0].patronymic;
                const funcion = protocol.Hits[0].department;
                const turno = protocol.Hits[0].comment;
                const hora = protocol.timestamp.split('T')[1].split('.')[0];

                const id_funcion = parseInt(funcion) || null;
                const id_turno = parseInt(turno) || null;
                const personInfo = {dni, fecha, hora, foto, id_funcion, id_turno};

                // Si el DNI ya existe en el Map, se compara la hora y se queda con la más temprana :
                if (!uniqueAsistentes.has(dni)) {
                    uniqueAsistentes.set(dni, personInfo);  // Si no existe, lo agregamos
                } else {
                    const existingPerson = uniqueAsistentes.get(dni);
                    if (new Date('1970-01-01T' + personInfo.hora) < new Date('1970-01-01T' + existingPerson.hora)) {
                        uniqueAsistentes.set(dni, personInfo);  // Si la nueva hora es más temprana, actualizamos el registro
                    }
                }
            }
        });

        // Convertir el Map a un array para devolverlo :
        return Array.from(uniqueAsistentes.values());
    }
    catch (error) {
        console.error('Error al consulta la API Protocols: ', error);
        return false;
    }
};

module.exports = {
    createPerson,
    readPerson,
    updatePerson,
    deletePerson,
    getEmpleadoId,
    getPhotoId,
    searchByFace,
    getProtocols
};
