const { 
    createPerson,
    readPerson,
    updatePerson,
    deletePerson,
    getEmpleadoId,
    getPhotoId,
    searchByFace,
    getProtocols
} = require('../controllers/axxonController');

// Handler CreatePerson (SOLO DE PRUEBA) :
const createPersonHandler = async (req, res) => {

    const { nombres, apellidos, dni, cargo, turno, foto } = req.body;
    if (!nombres){
        return res.status(400).json({ message: 'El parámetro NOMBRES es requerido y debe ser un String' });
    }
    if (!apellidos){
        return res.status(400).json({ message: 'El parámetro APELLIDOS es requerido y debe ser un String' });
    }
    if (!dni || typeof(dni) !== 'string'){
        return res.status(400).json({ message: 'El parámetro DNI es requerido y debe ser un String' });
    }
    if (dni.length !== 8) {
        return res.status(400).json({ message: 'El parámetro DNI debe tener 8 caracteres' });
    }
    if (!cargo || typeof(cargo) !== 'string'){
        return res.status(400).json({ message: 'El parámetro CARGO es requerido y debe ser un String' });
    }
    if (!turno || typeof(turno) !== 'string'){
        return res.status(400).json({ message: 'El parámetro TURNO es requerido y debe ser un String' });
    }
    if (!foto || typeof(foto) !== 'string'){
        return res.status(400).json({ message: 'El parámetro FOTO es requerido y debe ser un String' });
    }

    try {
        const result = await createPerson(nombres, apellidos, dni, cargo, turno, foto);
        if (result) {
            return res.status(200).json({ 
                message: 'Usuario creado con éxito',
                success: result
            });
        } else {
            return res.status(404).json({ 
                message: 'No se pudo crear al usuario',
                success: result
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta',
            error: error.message
        });
    }
};

// Handler ReadPerson (SOLO DE PRUEBA) :
const readPersonHandler = async (req, res) => {

    try {
        const data = await readPerson();
        if(data.length > 0){
            return res.status(200).json({
                message: 'Datos obtenidos exitosamente de ReadPerson',
                data: { data }
            });
        }
        else{
            return res.status(400).json({
                message: 'No se obtuvo ningún dato de ReadPerson',
                data: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta',
            error: error.message
        });
    }
};

// Handler UpdatePerson (SOLO DE PRUEBA) :
const updatePersonHandler = async (req, res) => {

    const { nombres, apellidos, dni, cargo, turno } = req.body;
    if (nombres !== null && typeof nombres !== 'string') {
        return res.status(400).json({ message: 'El parámetro NOMBRES debe ser un String' });
    }
    if (apellidos !== null && typeof apellidos !== 'string') {
        return res.status(400).json({ message: 'El parámetro APELLIDOS debe ser un String' });
    }
    if (!dni) {
        return res.status(400).json({ message: 'El parámetro DNI es obligatorio' });
    }
    if (dni.length !== 8) {
        return res.status(400).json({ message: 'El parámetro DNI debe tener 8 caracteres' });
    }
    if (cargo !== null && typeof cargo !== 'string') {
        return res.status(400).json({ message: 'El parámetro CARGO debe ser un String' });
    }
    if (turno !== null && typeof turno !== 'string') {
        return res.status(400).json({ message: 'El parámetro TURNO debe ser un String' });
    }

    try {
        const result = await updatePerson(nombres, apellidos, dni, cargo, turno);
        if (result) {
            return res.status(200).json({
                message: 'Usuario actualizado con éxito',
                success: result
            });
        } else {
            return res.status(400).json({
                message: 'No se pudo actualizar al usuario',
                success: result
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta',
            error: error.message
        });
    }
};

// Handler DeletePerson (SOLO DE PRUEBA) :
const deletePersonHandler = async (req, res) => {

    const { dni } = req.params;
    if(!dni){
        return res.status(400).json({ message: 'El parámetro DNI es requerido y debe ser un String' });
    }
    if(dni.length !== 8) {
        return res.status(400).json({ message: 'El parámetro DNI debe tener 8 caracteres' });
    }

    try {
        const result = await deletePerson(dni);
        if (result) {
            return res.status(200).json({
                message: 'Usuario eliminado con éxito',
                success: result
            });
        } else {
            return res.status(400).json({
                message: 'No se pudo eliminar al usuario',
                success: result
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta',
            error: error.message
        });
    }
};

// Handler GetEmpleadoId (SOLO DE PRUEBA) :
const getEmpleadoIdHandler = async (req, res) => {

    const { dni } = req.params;
    if(!dni || typeof(dni) !== 'string'){
        return res.status(400).json({ message: 'El parámetro DNI es requerido y debe ser un String' });
    }
    if (dni.length !== 8) {
        return res.status(400).json({ message: 'El parámetro DNI debe tener 8 caracteres' });
    }

    try {
        const empleadoId = await getEmpleadoId(dni);
        if (empleadoId){
            return res.status(200).json({
                message: 'Usuario encontrado exitosamente',
                success: true,
                id: empleadoId
            });
        }
        else{
            return res.status(400).json({
                message: 'Empleado no encontrado.',
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta para obtener el Id',
            error: error.message
        });
    }
};

// Handler GetPhoto (ESTE SI ES NECESARIO) :
const getPhotoHandler = async (req, res) => {

    const { id } = req.params;
    if(!id || typeof(id) !== 'string'){
        return res.status(400).json({ message: 'El parámetro ID es requerido y debe ser un String' });
    }

    try {
        const photo = await getPhotoId(id);
        if (photo) {
            return res.status(200).json({
                message: 'Imagen obtenida exitosamente',
                data: photo
            });
        } else {
            return res.status(400).json({
                message: 'No se pudo obtener la imagen',
                data: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta para obtener foto',
            error: error.message
        });
    }
};

// Handler SearchByFace (ESTE SI ES NECESARIO) :
const searchByFaceHandler = async (req, res) => {

    const { foto } = req.body;
    if(!foto){
        return res.status(400).json({ message: 'El parámetro FOTO es requerido' });
    }
    
    try {
        const personInfo = await searchByFace(foto);
        if (personInfo){
            return res.status(200).json({
                message: 'Persona reconocida exitosamente',
                data: personInfo
            });
        }
        else{
            return res.status(400).json({
                message: 'Persona no reconocida',
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la consulta para obtener el usuario por foto',
            error: error.message
        });
    }
};

// Handler GetProtocols (SOLO ES DE PRUEBA) :
const getProtocolsHandler = async (req, res) => {

    const { inicio, final } = req.body;
    if(!inicio) return res.status(400).json({ message: 'El parámetro FECHA HORA INICIO es obligatorio'});
    if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(inicio)){
        return res.status(400).json({ message: 'La FECHA HORA INICIO debe cumplir con el siguiente formato YYYY-MM-DDTHH:MM:SS.sss'});

    }
    if(!final) return res.status(400).json({ message: 'El parámetro FECHA HORA FINAL es obligatorio'});
    if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(final)){
        return res.status(400).json({ message: 'La FECHA HORA FINAL debe cumplir con el siguiente formato YYYY-MM-DDTHH:MM:SS.sss'});

    }

    try {
        const protocols = await getProtocols(inicio, final);
        if (protocols && protocols.length > 0){
            return res.status(200).json({
                message: 'Datos obtenidos exitosamente de Protocols',
                data: protocols
            });
        }
        else{
            return res.status(400).json({
                message: 'No se encontraron protocolos.',
                data: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los protocolos.',
            error: error.message
        });
    }
};

module.exports = {
    createPersonHandler,
    readPersonHandler,
    updatePersonHandler,
    deletePersonHandler,
    getEmpleadoIdHandler,
    getPhotoHandler,
    searchByFaceHandler,
    getProtocolsHandler
};
