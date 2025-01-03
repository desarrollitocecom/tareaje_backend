const { Feriado, Empleado } = require('../db_connection');
const { Op } = require('sequelize');

//Trae todas las Feriadoes y las pagina 
const getAllFeriados = async (page = 1, limit = 20) => {
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit; // Cálculo del offset
    try {
        const { count, rows } = await Feriado.findAndCountAll({
            where: { state: true },
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: count, data: rows, currentPage: page } || null;
    } catch (error) {
        console.error('Error al obtener todas las Feriados', error);
        return false;
    }
};
//trae una Feriado especifica por id
const getFeriado = async (id) => {
    try {
        const feriado = await Feriado.findOne({
            where: {
                id,
                state: true
            }
        });

        return feriado || null;
    } catch (error) {
        console.error(`Error al obtener el Feriado: ${error.message}`);
        return false
    }
};
//Crea una nueva Feriado
const createFeriado = async ({ nombre, fecha }) => {
    try {
        const feriado = await Feriado.create({ nombre, fecha });
        return feriado || null

    } catch (error) {
        console.error('Error al crear una nueva Feriado', error)
        return false
    }
};
//elimina la Feriado o canbia el estado
const deleteFeriado = async (id) => {
    try {
        const feriado = await Feriado.findByPk(id);
        feriado.state = false;
        await feriado.save();
        return feriado || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Feriado');
        return false;
    }
};


const updateFeriado = async (id, { nombre, fecha }) => {
    if (id)
        try {
            const feriado = await getFeriado(id);
            if (feriado)
                await feriado.update({ nombre, fecha });
            return feriado || null;

        } catch (error) {
            console.error('Error al actualizar la Feriado:', error.message);
            return false;
        }
    else
        return false;
};

const getFeriadoDiario = async (fecha) => {
    
    try {
        const response = await Feriado.findAll({
            where: {
                state: true,
                fecha: fecha
            },
            raw: true
        });
        if (!response || response.length === 0) return [];

        const empleados = await Empleado.findAll({
            where: {
                state: true,
                id_regimen_laboral: { [Op.ne]: 1 }
            },
            attributes: ['id']
        });
        const result = empleados.map(r => r.id);
        return result;
        
    } catch (error) {
        console.error('Error al obtener los descansos en un día:', error);
        return false;
    }
};

module.exports = {
    getAllFeriados,
    createFeriado,
    getFeriado,
    getFeriadoDiario,
    updateFeriado,
    deleteFeriado
};