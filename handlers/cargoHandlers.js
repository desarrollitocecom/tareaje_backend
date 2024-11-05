// handlers/cargoHandler.js
const { getCargoById, getAllCargos, createCargo, deleteCargo, updateCargo } = require('../controllers/cargoController');
const { Subgerencia } = require('../db_connection');
// Handler para obtener un Cargo por ID
const getCargoByIdHandler = async (req, res) => {
    const { id } = req.params
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const cargo = await getCargoById(id);
        if (!cargo) {
            return res.status(404).json({ message: 'Cargo no encontrado' });
        }
        return res.status(200).json({ data: cargo });
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener el cargo', details: error.message });
    }
};

// Handler para obtener todos los Cargos
const getAllCargosHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page <= 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const cargos = await getAllCargos(Number(page), Number(limit));
        if (cargos.length === 0 || page > limit) {
            return res.status(200).json(
                {
                    message: 'Ya no hay mas cargos',
                    data: {
                        data: [],
                        totalPage: cargos.currentPage,
                        totalCount: cargos.totalCount
                    }
                }
            );
        }
        return res.status(200).json({ data: cargos });

    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los cargos', details: error.message });
    }
};

const createCargoHandler = async (req, res) => {
    const { nombre, sueldo, id_subgerencia } = req.body;
    const errores = [];

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre contiene caracteres inválidos');
    }

    if (!sueldo) {
        errores.push('El campo sueldo es requerido');
    } 
    if (isNaN(sueldo)) {
        errores.push('El campo sueldo debe ser un número válido');
    }
    if (sueldo <= 0) {
        errores.push('El campo sueldo debe ser mayor a 0');
    }

    if (!id_subgerencia) {
        errores.push('El campo id_subgerencia es requerido');
    }
    if (isNaN(id_subgerencia)) {
        errores.push('El campo id_subgerencia debe ser un número válido');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const subgerenciaExiste = await Subgerencia.findByPk(id_subgerencia);
        if (!subgerenciaExiste) {
            return res.status(404).json({ error: 'La subgerencia con el ID proporcionado no existe' });
        }

        const newCargo = await createCargo({ nombre, sueldo: Number(sueldo), id_subgerencia: Number(id_subgerencia) });
        res.status(201).json({ message: 'Cargo creado exitosamente', data: newCargo });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el cargo', details: error.message });
    }
};

// Handler para eliminar un Cargo (cambia state a false)
const deleteCargoHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const cargo = await deleteCargo(id);
        if (!cargo) {
            return res.status(404).json({ message: 'Cargo no encontrado' });
        }
        res.status(200).json({ message: 'Cargo desactivado', data: cargo });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el cargo', details: error.message });
    }
};

// Handler para actualizar un Cargo
const updateCargoHandler = async (req, res) => {
    const { id } = req.params;
    const { nombre, sueldo, id_subgerencia } = req.body;
    const errores = [];

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    if (!validaNombre) {
        errores.push('El campo nombre contiene caracteres inválidos');
    }

    if (!sueldo) {
        errores.push('El campo sueldo es requerido');
    } 
    if (isNaN(sueldo)) {
        errores.push('El campo sueldo debe ser un número válido');
    }
    if (sueldo <= 0) {
        errores.push('El campo sueldo debe ser mayor a 0');
    }

    if (!id_subgerencia || isNaN((id_subgerencia))) {
        errores.push('El campo id_subgerencia debe ser un número válido');
    } else {
        const subgerenciaExists = await Subgerencia.findByPk(id_subgerencia);
        if (!subgerenciaExists) {
            errores.push('El id_subgerencia debe corresponder a una subgerencia existente');
        }
    }
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const updatedCargo = await updateCargo(id, { nombre, sueldo, id_subgerencia });
        if (!updatedCargo) {
            return res.status(404).json({ message: 'Cargo no encontrado' });
        }
        res.status(200).json({ message: 'Cargo actualizado', data: updatedCargo });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el cargo', details: error.message });
    }
};


module.exports = {
    getCargoByIdHandler,
    getAllCargosHandler,
    createCargoHandler,
    deleteCargoHandler,
    updateCargoHandler
};
