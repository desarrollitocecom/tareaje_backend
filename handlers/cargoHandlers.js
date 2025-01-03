const { response } = require('express');
const { getCargoById, getAllCargos, createCargo, deleteCargo, updateCargo } = require('../controllers/cargoController');

const { createHistorial } = require('../controllers/historialController');

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
        return res.status(500).json({ error: 'Error al obtener el cargo', data: error.message });
    }
};

// Handler para obtener todos los Cargos
const getAllCargosHandler = async (req, res) => {

    const { page = 1, limit = 20, search } = req.query;
    const filters = { search };
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un numero");
    if (page < 0) errores.push("El page debe ser mayor a 0 ");
    if (isNaN(limit)) errores.push("El limit debe ser un numero");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0 ");

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getAllCargos(numPage, numLimit, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if(numPage > totalPages){
            return res.status(200).json({
                message:'Página fuera de rango...',
                data:{
                    data:[],
                    currentPage: numPage,
                    pageCount: response.data.length,
                    totalCount: response.totalCount,
                    totalPages: totalPages,
                 }
                }
            );
        }
        
        return res.status(200).json({
            message: 'Cargos obtenidos exitosamente...',
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });
        
    } catch (error) {
        console.error('Error al obtener todas los cargos en el handler', error);
        return res.status(500).json({ message: "Error al obtener todas los cargos en el handler" });
    }
};

// Handler para crear un nuevo Cargo
const createCargoHandler = async (req, res) => {

    const { nombre, sueldo, id_subgerencia } = req.body;
    const token = req.user;
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);
    const errores = [];

    if (!nombre) errores.push('El campo nombre es requerido');
    if (typeof nombre !== 'string') errores.push('El nombre debe ser una cadena de texto')
    if (!validaNombre) errores.push('el nombre debe estar sin números ni caracteres especiales')
    if (!nombre && !sueldo && !id_subgerencia) errores.push('todos los campos son requeridos')
    if (typeof sueldo !== 'number') errores.push('el sueldo debe ser un numero')
    if (isNaN(sueldo)) {
        errores.push('El sueldo debe ser un numero')
    } else if (sueldo <= 0) {
        errores.push('El sueldo no debe tener cantidades negativas')
    }
    if (isNaN(id_subgerencia)) {
        errores.push('El id_subgerencia debe ser un numero')
    } else if (id_subgerencia <= 0) {
        errores.push('El id_subgerencia no debe tener cantidades negativas')
    }
    if (errores.length > 0)
        return res.status(400).json({ message:'Se encontraron los siguientes errores',errores });

    try {
        const newCargo = await createCargo({ nombre, sueldo, id_subgerencia });
        if (!newCargo) return res.status(400).json({ message: 'Cargo no creado', data: [] });

        const historial = await createHistorial(
            'create',
            'Cargo',
            'nombre, sueldo, id_subgerencia',
            null,
            `${nombre}, ${sueldo}, ${id_subgerencia}`,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(201).json({ message: 'Cargo creado exitosamente', data: newCargo });
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear el cargo', data: error.message });
    }
};

// Handler para eliminar un Cargo (cambia state a false)
const deleteCargoHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;
    try {
        const cargo = await deleteCargo(id);
        if (!cargo) {
            return res.status(404).json({ message: 'Cargo no encontrado' });
        }

        const historial = await createHistorial(
            'delete',
            'Cargo',
            'nombre, sueldo, id_subgerencia',
            `${cargo.nombre}, ${cargo.sueldo}, ${cargo.id_subgerencia}`,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        res.status(200).json({ message: 'Cargo desactivado', data: cargo });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el cargo', details: error.message });
    }
};

// Handler para actualizar un Cargo
const updateCargoHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre, sueldo, id_subgerencia } = req.body;
    const token = req.user;
    const errores = [];
    const validaNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre);   
    if (!nombre) errores.push('El campo nombre es requerido');
    if (typeof nombre !== 'string') errores.push('El nombre debe ser una cadena de texto')
    if (!validaNombre) errores.push('el nombre debe estar sin números ni caracteres especiales')
    if (!nombre && !sueldo && !id_subgerencia) errores.push('todos los campos son requeridos')
    if (typeof sueldo !== 'number') errores.push('el sueldo debe ser un numero')
    if (isNaN(sueldo)) {
        errores.push('El sueldo debe ser un numero')
    } else if (sueldo <= 0) {
        errores.push('El sueldo no debe tener cantidades negativas')
    }
    if (isNaN(id_subgerencia)) {
        errores.push('El id_subgerencia debe ser un numero')
    } else if (id_subgerencia <= 0) {
        errores.push('El id_subgerencia no debe tener cantidades negativas')
    }
    if (isNaN(id)) {
        errores.push('El id debe ser un numero')
    } else if (id <= 0) {
        errores.push('El id no debe tener cantidades negativas')
    }
    if (errores.length > 0) {
        return res.status(400).json({message:"Estos son los siguientes errores encontrados", data:errores });
    }

    try {
        const previo = await getCargoById(id);
        const updatedCargo = await updateCargo(id, { nombre, sueldo, id_subgerencia });
        if (!updatedCargo) {
            return res.status(404).json({ message: 'Cargo no encontrado' });
        }

        const anterior = [previo.nombre, previo.sueldo, previo.id_subgerencia];
        const nuevo = [nombre, sueldo, id_subgerencia];
        const campos = ['nombre', 'sueldo', 'id_subgerencia'];
        let historial;

        for (let i = 0; i < anterior.length; i++) {
            if (anterior[i] !== nuevo[i]) {
                historial = await createHistorial(
                    'update',
                    'Cargo',
                    campos[i],
                    anterior[i],
                    nuevo[i],
                    token
                );
                if (!historial) console.warn('No se agregó al historial...');
            }
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