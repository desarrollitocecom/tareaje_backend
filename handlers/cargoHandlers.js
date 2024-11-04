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
    const {page=1,limit=20}=req.query;
    try {
        const cargos = await getAllCargos(Number(page),Number(limit));
        if(cargos.length === 0 || page>limit){
            return res.status(200).json(
                {message:'Ya no hay mas cargos',
                 data:{
                    data:[],
                    totalPage:cargos.currentPage,
                    totalCount:cargos.totalCount
                 }   
                }
            );
        }
       return res.status(200).json({ data: cargos });

    } catch (error) {
       return  res.status(500).json({ error: 'Error al obtener los cargos', details: error.message });
    }
};

// Handler para crear un nuevo Cargo
const createCargoHandler = async (req, res) => {
    const { nombre, sueldo, id_subgerencia } = req.body;

    // Validación de campos requeridos
    if (!nombre || !sueldo || !id_subgerencia) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    if (typeof sueldo !== 'number' || isNaN(sueldo)) {
        return res.status(400).json({ error: 'El campo sueldo debe ser un número válido' });
    }


    try {
        const newCargo = await createCargo({ nombre, sueldo, id_subgerencia });
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

    // Validación: Asegúrate de que sueldo sea un número válido y no un valor NaN o string
    if (sueldo !== undefined && (typeof sueldo !== 'number' || isNaN(sueldo))) {
        return res.status(400).json({ error: 'El campo sueldo debe ser un número válido' });
    }

    // Validación: Asegúrate de que id_subgerencia corresponde a una subgerencia existente
    if (id_subgerencia !== undefined) {
        const subgerenciaExists = await Subgerencia.findByPk(id_subgerencia);
        if (!subgerenciaExists) {
            return res.status(400).json({ error: 'El id_subgerencia debe corresponder a una subgerencia existente' });
        }
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
