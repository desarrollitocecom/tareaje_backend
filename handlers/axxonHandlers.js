const { createPerson, readPerson, deletePerson, getEmpleadoId, getPhotoId, searchByFace, getProtocols } = require('../controllers/axxonController');
const { getEmpleadoByDni, getEmpleado } = require("../controllers/empleadoController");



// Handler CreatePerson (SOLO DE PRUEBA) :
const createPersonHandler = async (req, res) => {

    const { nombres, apellidos, dni, cargo, turno, foto } = req.body;
    if (!nombres) {
        return res.status(400).json({ message: 'El parámetro NOMBRES es requerido y debe ser un String' });
    }
    if (!apellidos) {
        return res.status(400).json({ message: 'El parámetro APELLIDOS es requerido y debe ser un String' });
    }
    if (!dni || typeof (dni) !== 'string') {
        return res.status(400).json({ message: 'El parámetro DNI es requerido y debe ser un String' });
    }
    if (dni.length !== 8) {
        return res.status(400).json({ message: 'El parámetro DNI debe tener 8 caracteres' });
    }
    if (!cargo || typeof (cargo) !== 'string') {
        return res.status(400).json({ message: 'El parámetro CARGO es requerido y debe ser un String' });
    }
    if (!turno || typeof (turno) !== 'string') {
        return res.status(400).json({ message: 'El parámetro TURNO es requerido y debe ser un String' });
    }
    if (!foto || typeof (foto) !== 'string') {
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
        if (data.length > 0) {
            return res.status(200).json({
                message: 'Datos obtenidos exitosamente de ReadPerson',
                data: { data }
            });
        }
        else {
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

// Handler DeletePerson (SOLO DE PRUEBA) :
const deletePersonHandler = async (req, res) => {

    const { dni } = req.params;
    if (!dni) {
        return res.status(400).json({ message: 'El parámetro DNI es requerido y debe ser un String' });
    }
    if (dni.length !== 8) {
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
    if (!dni || typeof (dni) !== 'string') {
        return res.status(400).json({ message: 'El parámetro DNI es requerido y debe ser un String' });
    }
    if (dni.length !== 8) {
        return res.status(400).json({ message: 'El parámetro DNI debe tener 8 caracteres' });
    }

    try {
        const empleadoId = await getEmpleadoId(dni);
        if (empleadoId) {
            return res.status(200).json({
                message: 'Usuario encontrado exitosamente',
                success: true,
                id: empleadoId
            });
        }
        else {
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
    if (!id || typeof (id) !== 'string') {
        return res.status(400).json({ message: 'El parámetro ID es requerido y debe ser un String' });
    }

    try {
        const photo = await getPhotoId(id);
        if (photo) {
            res.set('Content-Type', 'image/jpeg');
            return res.status(200).send(photo.data);
        } else {
            return res.status(400).json({
                message: 'No se pudo obtener la imagen',
                data: []
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
    if (!foto) {
        return res.status(400).json({ message: 'El parámetro FOTO es requerido' });
    }

    try {
        const personInfo = await searchByFace(foto);
        if (personInfo) {
        const personId = await getEmpleadoByDni(personInfo.dni);
        //console.log("personID:",personId);
        const personDetail = await getEmpleado(personId.dataValues.id)
            return res.status(200).json({
                message: 'Persona reconocida exitosamente',
                data: {
                    nombres: personDetail.apellidos+" "+personDetail.nombres,
                    subgerencia: personDetail.subgerencia.nombre,
                    //foto: personDetail.foto,
                }
            });
        }
        else {
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

    const { fecha, hora } = req.body;
    if (!fecha) return res.status(400).json({ message: 'El parámetro FECHA  es obligatorio' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return res.status(400).json({ message: 'La FECHA debe cumplir con el siguiente formato YYYY-MM-DD' });

    }
    if (!hora) return res.status(400).json({ message: 'El parámetro HORA es obligatorio' });
    if (isNaN(hora)) {
        return res.status(400).json({ message: 'La HORA debe ser un numero' });

    }

    try {
        const protocols = await getProtocols(fecha, hora);
        if (protocols && protocols.length > 0) {
            return res.status(200).json({
                message: 'Datos obtenidos exitosamente de Protocols',
                data: protocols
            });
        }
        else {
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
    deletePersonHandler,
    getEmpleadoIdHandler,
    getPhotoHandler,
    searchByFaceHandler,
    getProtocolsHandler
};
