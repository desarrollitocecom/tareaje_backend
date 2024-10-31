const { Cargo, Subgerencia } = require('../db_connection');

// Obtener un Cargo por ID con su Subgerencia
const getCargoById = async (id) => {
    try {
        const cargo = await Cargo.findOne({
            where: {
                id,
            },
            include: [{ model: Subgerencia, as: 'Subgerencia' }]
        });
        
        return cargo;
           
    } catch (error) {
        console.error('Error al obtener el cargo por ID:', error);
        throw error;
    }
};

// Obtener todos los Cargos con sus Subgerencias
const getAllCargos = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const cargos = await Cargo.findAndCountAll({
            where: { state: true },
            include: [{ model: Subgerencia, as: 'Subgerencia' }],
            limit,
            offset
        });
        return {
            total: cargos.count,
            data:cargos.rows,
            currentPage: page
        } || null;
    } catch (error) {
        console.error('Error al obtener todos los cargos:', error);
        throw error;
    }
};

// Crear un nuevo Cargo
const createCargo = async (cargoData) => {
    try {
        const newCargo = await Cargo.create(cargoData);
        return newCargo;
    } catch (error) {
        console.error('Error al crear un nuevo cargo:', error);
        throw error;
    }
};

// Eliminar un Cargo (cambiar state a false)
const deleteCargo = async (id) => {
    try {
        const cargo = await Cargo.findByPk(id);
        if (!cargo) {
            return null; // Si el cargo no existe, retorna null
        }
        // Cambia el estado a false en lugar de eliminar
        cargo.state = false;
        await cargo.save();
        return cargo;
    } catch (error) {
        console.error('Error al eliminar el cargo:', error);
        throw error;
    }
};

// Modificar un Cargo
const updateCargo = async (id, cargoData) => {
    try {
        const cargo = await Cargo.findByPk(id);
        if (!cargo) {
            return null; // Si el cargo no existe, retorna null
        }

        await cargo.update(cargoData);
        return cargo;
    } catch (error) {
        console.error('Error al actualizar el cargo:', error);
        throw error;
    }
};

module.exports = { getCargoById, getAllCargos, createCargo, deleteCargo, updateCargo };
