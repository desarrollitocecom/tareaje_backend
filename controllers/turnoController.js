const {Turno}= require('../db_connection');

//Trae todas las Turnoes
const getTurnos=async () => {
    try {
        const response=await Turno.findAll({where: {
            state:true  
        }});
        return response || null
    } catch (error) {
        console.error('Error al Obtener todas las Turnoes ',error);
        return false
    }
}

//trae una Turno especifica por id
const getTurno = async (id) => {
    try {
        const Turno = await Turno.findOne({where: {
            id ,
            state:true
        }});
        return Turno || null;
    } catch (error) {
        console.error(`Error al obtener la Turno: ${error.message}`);
      return false
    }
};
//Crea una nueva Turno
const createTurno = async ({nombre}) => {
    try {
        const Turno = await Turno.create({ nombre });
        return Turno 
    } catch (error) {
        console.error('Error al crear una nueva Turno',error)
        return false
    }
};
//elimina la Turno o canbia el estado
const deleteTurno = async (id) => {
    try {
        const Turno = await Turno.findByPk(id);
        Turno.state = false;
        await Turno.save();
       return Turno || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Turno');
        return false;
    }
};


const updateTurno = async (id, nuevaTurno) => {
    if (id && nuevaTurno)
        try {
            const Turno = await getTurno(id);
            if (Turno) 
                await Turno.update(nuevaTurno);
                return Turno || null;
            
        } catch (error) {
            console.error('Error al actualizar la Turno:', error.message);
            return false;
        }
    else
        return false;
};  



module.exports = {
    getTurnos,
    createTurno,
    getTurno,
    updateTurno,
    deleteTurno
};