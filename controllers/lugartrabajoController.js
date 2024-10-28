const {LugarTrabajo} = require('../db_connection');

//Trae todas las LugarTrabajoes
const getLugarTrabajos=async () => {
    try {
        const response=await LugarTrabajo.findAll({where: {
            state:true  
        }});
        return response || null
    } catch (error) {
        console.error('Error al Obtener todas las LugarTrabajoes',error);
        return false
    }
}

//trae una LugarTrabajo especifica por id
const getLugarTrabajo = async (id) => {
    try {
        const LugarTrabajo = await LugarTrabajo.findAll({where: {
            id ,
            state:true
        }});
        return LugarTrabajo || null;
    } catch (error) {
        console.error(`Error al obtener la Función: ${error.message}`);
      return false
    }
};
//Crea una nueva LugarTrabajo
const createLugarTrabajo = async ({nombre}) => {
    try {
        const LugarTrabajo = await LugarTrabajo.create({ nombre });
        return LugarTrabajo

    } catch (error) {
        console.error('Error al crear una nueva LugarTrabajo',error)
        return false
    }
};
//elimina la LugarTrabajo o canbia el estado
const deleteLugarTrabajo = async (id) => {
    try {
        const LugarTrabajo = await LugarTrabajo.findByPk(id);
        LugarTrabajo.state = false;
        await LugarTrabajo.save();
       return LugarTrabajo || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar LugarTrabajo');
        return false;
    }
};


const updateLugarTrabajo = async (id, nuevaLugarTrabajo) => {
    if (id && nuevaLugarTrabajo)
        try {
            const LugarTrabajo = await LugarTrabajo.findOne({ where: { id } });
            if (LugarTrabajo) 
                await LugarTrabajo.update(nuevaLugarTrabajo);
                return LugarTrabajo || null;
            
           
        } catch (error) {
            console.error('Error al actualizar la LugarTrabajo:', error.message);
            return false;
        }
    else
        return false;
};  



module.exports = {
    getLugarTrabajos,
    createLugarTrabajo,
    getLugarTrabajo,
    updateLugarTrabajo,
    deleteLugarTrabajo
};