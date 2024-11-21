const {
    getLugarTrabajos,
    createLugarTrabajo,
    getLugarTrabajo,
    updateLugarTrabajo,
    deleteLugarTrabajo
} = require('../controllers/lugarTrabajoController');

const { createHistorial } = require('../controllers/historialController');
const { logger } = require('sequelize/lib/utils/logger');

// Handlers para obtener los Lugar de Trabajo
const getLugarTrabajosHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page <= 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if(errores.length>0){
        return res.status(400).json({ errores });
    }
    try {
        const response = await getLugarTrabajos(Number(page), Number(limit));
        if (response.length === 0 || page > limit) {
            return res.status(200).json(
                {
                    message: 'Ya no hay mas lugares de trabajo',
                    data: {
                        data: [],
                        totalPage: response.currentPage,
                        totalCount: response.totalCount
                    }
                }
            );
        }
        return res.status(200).json({
            message: 'Son los Lugar Trabajos',
            data: response
        })
    } catch (error) {
        console.error('Error al obtener todas los Lugar de Trabajos ', error)
        return res.status(500).json({ message: "Error al obtener todas las Lugar de trabajo" })
    }
};

// Handlers para obtener una LugarTrabajo 
const getLugarTrabajoHandler = async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await getLugarTrabajo(id);

        if (!response || response.length === 0) {
            return res.status(404).json({
                message: "Lugares de trabajo no encontrado",
                data: []
            });
        }

        return res.status(200).json({
            message: "Lugares de trabajo encontrada",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al buscar la Lugares de trabajo",
            error: error.message
        });
    }
};

// Handlers para crear un nuevo LugarTrabajo
const createLugarTrabajoHandler = async (req, res) => {
    
    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre debe contener solo letras y espacios');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const nuevaLugarTrabajo = await createLugarTrabajo({ nombre });
        const historial = await createHistorial(
            'create',
            'LugarTrabajo',
            'nombre',
            null,
            nombre,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');
        return res.status(201).json({
            message: 'Lugar de Trabajo creado exitosamente',
            data: nuevaLugarTrabajo
        });

    } catch (error) {
        console.error('Error al crear el Lugar de Trabajo:', error);
        return res.status(500).json({ message: 'Error al crear el Lugar de Trabajo', error });
    }
};

// Handler para modificar un Lugar de Trabajo
const updateLugarTrabajoHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre } = req.body;
    const token = req.user;
    const errores = [];

    if (!id) {
        errores.push('El campo ID es requerido');
    }
    if (isNaN(id)) {
        errores.push('El campo ID debe ser un número válido');
    }

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre debe contener solo letras y espacios');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const previo = await getLugarTrabajo(id);
        const response = await updateLugarTrabajo(id, { nombre });
        if (!response) {
            return res.status(404).json({
                message: "El Lugar de Trabajo no se encuentra",
                data: {}
            });
        }

        const historial = await createHistorial(
            'update',
            'LugarTrabajo',
            'nombre',
            previo.nombre,
            nombre,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: "Registro modificado",
            data: response
        });
    } catch (error) {
        console.error('Error al modificar el Lugar de Trabajo:', error);
        return res.status(500).json({ message: "Error al modificar el Lugar de Trabajo", error });
    }
};

const deleteLugarTrabajoHandler = async (req, res) => {
    
    const id = req.params.id;
    const token = req.user;

    // Validación del ID
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }

    try {
        // Llamada a la función para eliminar (estado a inactivo)
        const response = await deleteLugarTrabajo(id);

        if (!response) {
            return res.status(204).json({
                message: `No se encontró la Lugar de Trabajo con ID${id}`
            })
        }

        const historial = await createHistorial(
            'delete',
            'LugarTrabajo',
            'nombre',
            response.nombre,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({
            message: 'Lugares de Trabajo eliminado correctamente '
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getLugarTrabajosHandler,
    getLugarTrabajoHandler,
    createLugarTrabajoHandler,
    updateLugarTrabajoHandler,
    deleteLugarTrabajoHandler
}

