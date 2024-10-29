const{ Jurisdiccion}= require('../db_connection');

//Trae todas las Jurisdicciones
const getJurisdicciones=async () => {
    try {
        const response=await Jurisdiccion.findAll({where: {
            state:true  
        }});
        return response || null
    } catch (error) {
        console.error('Error al Obtener todas las Jurisdicciones ',error);
        return false
    }
}

//trae una Jurisdiccion especifica por id
const getJurisdiccion = async (id) => {
    try {
        const newJurisdiccion = await Jurisdiccion.findOne({where: {
            id ,
            state:true
        }});
        return newJurisdiccion || null;
    } catch (error) {
        console.error(`Error al obtener la Jurisdiccion: ${error.message}`);
      return false
    }
};
//Crea una nueva Jurisdiccion
const createJurisdiccion = async ({nombre}) => {
    try {
        const newJurisdiccion = await Jurisdiccion.create({ nombre });
        return newJurisdiccion 
    } catch (error) {
        console.error('Error al crear una nueva Jurisdiccion',error)
        return false
    }
};
//elimina la Jurisdiccion o canbia el estado
const deleteJurisdiccion = async (id) => {
    try {
        const newJurisdiccion = await Jurisdiccion.findByPk(id);
        newJurisdiccion.state = false;
        await newJurisdiccion.save();
       return newJurisdiccion || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Jurisdiccion');
        return false;
    }
};


const updateJurisdiccion = async (id, nuevaJurisdiccion) => {
    if (id && nuevaJurisdiccion)
        try {
            const newJurisdiccion = await Jurisdiccion.findOne({ where: { id } });
            if (newJurisdiccion) 
                await newJurisdiccion.update(nuevaJurisdiccion);
                return newJurisdiccion || null;
            
        } catch (error) {
            console.error('Error al actualizar la Jurisdiccion:', error.message);
            return false;
        }
    else
        return false;
};  



module.exports = {
    getJurisdicciones,
    createJurisdiccion,
    getJurisdiccion,
    updateJurisdiccion,
    deleteJurisdiccion
};