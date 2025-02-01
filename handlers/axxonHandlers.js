const { 
    createPerson,
    readPerson, 
    deletePerson, 
    getEmpleadoId,
    getPhotoId,
    searchByFace,
    getProtocols 
} = require('../controllers/axxonController');

const {
    getEmpleadoIdByDni,
    getEmpleadoByIdAttributes
} = require('../controllers/empleadoController');

const { getHorarioFace } = require('../controllers/horarioController');

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
    if (!foto) return res.status(400).json({ message: 'La foto es obligatoria' });

    try {
        const response = await searchByFace(foto);
        const id = await getEmpleadoIdByDni(response.dni);
        if (!id) {
            const error = new Error('No se pudo encontrar a la persona');
            error.statusCode = 404;
            throw error;
        }

        const empleado = await getEmpleadoByIdAttributes(id);
        if (!empleado) {
            const error = new Error('No se pudo encontrar a la persona');
            error.statusCode = 404;
            throw error;
        }

        const hora = await getHorarioFace(empleado.id_subgerencia, empleado.id_turno, empleado.id_area);

        const inicio = (hora) ? parseInt(hora.inicio.split(':')[0]) : 0;
        const fin = (hora) ? parseInt(hora.fin.split(':')[0]) : 24;

        return res.status(200).json({
            message: 'Persona reconocida exitosamente...',
            data: {
                subgerencia: empleado['subgerencia.nombre'],
                turno: empleado['turno.nombre'],
                estado: empleado.state,
                inicio: inicio,
                fin: fin
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error?.message,
            statusCode: error?.statusCode,
            error: 'Error al detectar persona'
        });
    }
};

const searchByFaceDNIHandler = async (req, res) => {

    const { foto } = req.body;
    if (!foto) return res.status(400).json({ message: 'La foto es obligatoria' });

    try {
        const response = await searchByFace(foto);
        const id = await getEmpleadoIdByDni(response.dni);
        if (!id){
            const error = new Error('No se pudo encontrar a la persona');
            error.statusCode = 404;
            throw error;
        }
        
        const empleado = await getEmpleadoByIdAttributes(id);
        if(!empleado) {
            const error = new Error('No se pudo encontrar a la persona');
            error.statusCode = 404;
            throw error;
        }

        const hora = await getHorarioFace(empleado.id_subgerencia, empleado.id_turno, empleado.id_area);
        const ahora = new Date();
        const horaBetween = ahora.getHours();

        const inicio = (hora) ? parseInt(hora.inicio.split(':')[0]) : 0;
        const fin = (hora) ? parseInt(hora.fin.split(':')[0]) : 24;

        let estado;
        if (inicio < fin) estado = (horaBetween >= inicio && horaBetween < fin);
        else estado = (horaBetween >= inicio || horaBetween < fin);
        
        return res.status(200).json({
            message: `Bienvenido ${empleado.nombres.split(" ")[0]} ${empleado.apellidos.split(" ")[0]}`,
            data: {
                nombres: empleado.nombres,
                apellidos: empleado.apellidos,
                dni: empleado.dni,
                id_subgerencia: empleado.id_subgerencia,
                subgerencia: empleado['subgerencia.nombre'],
                turno: empleado['turno.nombre'],
                celular: empleado.celular,
                inicio: inicio,
                fin: fin,
                estado: estado
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error?.message,
            statusCode: error?.statusCode,
            error: 'Error al detectar persona'
        });
    }
};

// Handler GetProtocols (SOLO ES DE PRUEBA) :
const getProtocolsHandler = async (req, res) => {

    const { fecha, hora } = req.body;
    const errores = [];

    if (!fecha) errores.push('El parámetro FECHA  es obligatorio' );
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.push('La FECHA debe cumplir con el siguiente formato YYYY-MM-DD' );
    if (isNaN(hora)) errores.push('La HORA debe ser un numero' );
    if (errores.length > 0) return res.status(400).json({
        message: "Se encontraron los siguentes errores:",
        data: errores
    });

    try {
        const protocols = await getProtocols(fecha, hora);
        if (!protocols || protocols.length === 0) return res.status(200).json({
            message: 'No se encontraron registros de Protocols...',
            data: []
        });

        return res.status(200).json({
            message: 'Registros obtenidos exitosamente de Protocols...',
            data: protocols
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los registros de Protocols',
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
    getProtocolsHandler,
    searchByFaceDNIHandler
};
