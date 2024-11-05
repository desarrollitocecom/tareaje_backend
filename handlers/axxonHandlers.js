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

// Handler CreatePerson :
const createPersonHandler = async (req, res) => {
    const { nombres, apellidos, dni, cargo, turno, foto } = req.body;
    if (!nombres || typeof(nombres) !== 'string'){
        return res.status(400).json({ message: 'El parámetro NOMBRES es requerido y debe ser un String' });
    }
    if (!apellidos || typeof(apellidos) !== 'string'){
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
            res.status(200).json({ 
                message: 'Usuario creado con éxito',
                success: result
            });
        } else {
            res.status(404).json({ 
                message: 'No se pudo crear al usuario',
                success: result
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error en la consulta',
            error: error.message
        });
    }
};

// Handler ReadPerson :
const readPersonHandler = async (res) => {
    try {
        const data = await readPerson();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener las personas',
            error: error.message
        });
    }
};

// Handler UpdatePerson :
const updatePersonHandler = async (req, res) => {
    const { dnikey } = req.params;
    const { nombres, apellidos, dni, cargo, turno } = req.body;
    if (!dnikey || typeof(dnikey) !== 'string'){
        return res.status(400).json({ message: 'El parámetro DNI KEY es requerido y debe ser un String' });
    }
    if (dnikey.length !== 8) {
        return res.status(400).json({ message: 'El parámetro DNI KEY debe tener 8 caracteres' });
    }
    if (nombres !== null && typeof nombres !== 'string') {
        return res.status(400).json({ message: 'El parámetro NOMBRES debe ser un String' });
    }
    if (apellidos !== null && typeof apellidos !== 'string') {
        return res.status(400).json({ message: 'El parámetro APELLIDOS debe ser un String' });
    }
    if (dni !== null && typeof dni !== 'string') {
        return res.status(400).json({ message: 'El parámetro DNI debe ser un String' });
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
        const result = await updatePerson(dnikey, nombres, apellidos, dni, cargo, turno);
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

// Handler DeletePerson :
const deletePersonHandler = async (req, res) => {
    const { dnikey } = req.params;
    if(!dnikey || typeof(dnikey) !== 'string'){
        return res.status(400).json({ message: 'El parámetro DNI es requerido y debe ser un String' });
    }
    if (dnikey.length !== 8) {
        return res.status(400).json({ message: 'El parámetro DNI debe tener 8 caracteres' });
    }
    try {
        const result = await deletePerson(dnikey);
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

// Handler GetEmpleadoId :
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
        if (empleadoId) res.json({ success: true, id: empleadoId });
        else res.status(404).json({ success: false, message: 'Empleado no encontrado.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el ID del empleado.' });
    }
};

// Handler GetPhoto :
const getPhotoHandler = async (req, res) => {
    const { id } = req.params;
    if(!id || typeof(id) !== 'string'){
        return res.status(400).json({ message: 'El parámetro ID es requerido y debe ser un String' });
    }
    const photo = await getPhotoId(id);
    if (photo) {
        return res.status(200).json(photo);
    } else {
        return res.status(500).json({ message: 'Error al obtener la imagen' });
    }
};

// Handler SearchByFace :
const searchByFaceHandler = async (req, res) => {
    const { foto } = req.body;
    if(!foto || typeof(foto) !== 'string'){
        return res.status(400).json({ message: 'El parámetro FOTO es requerido y debe ser un String' });
    }
    try {
        const personInfo = await searchByFace(foto);
        if (personInfo) return res.json(personInfo);
        else{
            return res.status(404).json({
                message: 'Persona no reconocida.',
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error al procesar el reconocimiento facial.',
            success: false
        });
    }
};

// Handler GetProtocols :
const getProtocolsHandler = async (req, res) => {
    const {rango } = req.body;
    try {
        const protocols = await getProtocols(rango);
        if (protocols && protocols.length > 0) return res.json(protocols);
        else return res.status(404).json({ success: false, message: 'No se encontraron protocolos.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener los protocolos.' });
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
