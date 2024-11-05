const { RangoHorario, Turno, Cargo } = require('../db_connection');

// Obtener un RangoHorario por ID con su Turno
const getRangoHorarioById = async (id) => {
    try {
        const rangoHorario = await RangoHorario.findByPk(id);
        if(rangoHorario) {
            console.error('RangoHorario obtenido correctamente...');
            return rangoHorario;
        }
        else{
            console.error('Para este Id no esta asociado un RangoHorario');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el rango horario por ID:', error);
        return false;
    }
};

// Obtener todos los RangosHorario con paginación :
const getAllRangosHorarios = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const rangosHorarios = await RangoHorario.findAndCountAll({
            where: { state: true },
            include: [
                { model: Cargo, as: 'Cargo' },
                { model: Turno, as: 'Turno' }
            ],
            limit,
            offset
        });
        return {
            totalCount: rangosHorarios.count,
            data: rangosHorarios.rows,
            currentPage: page
        } || null;
    } catch (error) {
        console.error('Error al obtener todos los rangos horarios:', error);
        return false;
    }
};

// Obtener todos los RangosHorario sin paginación (SIN HANDLER) :
const getAllRangosHorariosTotal = async () => {
    try {
        const rangosHorarios = await RangoHorario.findAll({
            where: { state: true },
            include: [
                { model: Cargo, as: 'Cargo' },
                { model: Turno, as: 'Turno' }
            ]
        });
        return rangosHorarios;
    } catch (error) {
        console.error('Error al obtener todos los rangos horarios:', error);
        return false;
    }
};

// Obtener el Id de Cargo y Turno por Hora de Inicio (SIN HANDLER) :
const getCargoTurnoIdsByInicio = async (hora_inicio) => {
    try {
        const cargosConTurnos = await RangoHorario.findAll({
            attributes: [],
            where: {
                inicio: hora_inicio,
                state: true
            },
            include: [
                {
                    model: Cargo,
                    as: 'cargo',
                    attributes: ['id']
                },
                {
                    model: Turno,
                    as: 'turno',
                    attributes: ['id']
                }
            ]
        });

        // Mapea el resultado para obtener solo los IDs
        const ids = cargosConTurnos.map((rango) => ({
            cargoId: rango.cargo.id,
            turnoId: rango.turno.id
        }));

        return ids;
    } catch (error) {
        console.error('Error al obtener los IDs de cargos y turnos por hora de inicio:', error);
        return false;
    }
};

// Crear un nuevo RangoHorario :
const createRangoHorario = async (inicio, fin, id_cargo, id_turno) => {
    const state = true;
    try {
        const newRangoHorario = await RangoHorario.create({ inicio, fin, state, id_cargo, id_turno });
        return newRangoHorario;
    } catch (error) {
        console.error('Error al crear un nuevo rango horario:', error);
        return false;
    }
};

// Actualizar un RangoHorario
const updateRangoHorario = async (id, rangoHorarioData) => {
    try {
        const rangoHorario = await RangoHorario.findByPk(id);
        if (!rangoHorario) {
            return null;
        }
        const updatedFields = {};
        if (rangoHorarioData.inicio) {
            updatedFields.inicio = rangoHorarioData.inicio;
        }
        if (rangoHorarioData.fin) {
            updatedFields.fin = rangoHorarioData.fin;
        }
        await rangoHorario.update(updatedFields);
        console.log('RangoHorario actualizado correctamente');
        return rangoHorario;
    } catch (error) {
        console.error('Error al actualizar el rango horario:', error);
        return false;
    }
};

// Eliminar un RangoHorario (Cambio del state a false)
const deleteRangoHorario = async (id) => {
    try {
        const rangoHorario = await RangoHorario.findByPk(id);
        if (!rangoHorario) {
            return null;
        }
        rangoHorario.state = false;
        await rangoHorario.save();
        return rangoHorario;
    } catch (error) {
        console.error('Error al eliminar el rango horario:', error);
        return false
    }
};

module.exports = {
    getRangoHorarioById,
    getAllRangosHorarios,
    getAllRangosHorariosTotal,
    getCargoTurnoIdsByInicio,
    createRangoHorario,
    updateRangoHorario,
    deleteRangoHorario
};
