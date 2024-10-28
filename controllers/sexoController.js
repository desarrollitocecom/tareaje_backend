const {Sexo} = require('../db_connection');

//Trae todas las Sexoes
const getSexos=async () => {
    try {
        const response=await Sexo.findAll({where: {
            state:true  
        }});
        return response || null
    } catch (error) {
        console.error('Error al Obtener todas las Sexoes',error);
        return false
    }
}

//trae una Sexo especifica por id
const getSexo = async (id) => {
    try {
        const response = await Sexo.findOne({where: {
            id ,
            state:true
        }});
        return response || null;
    } catch (error) {
        console.error(`Error al obtener la Función: ${error.message}`);
      return false
    }
};
//Crea una nueva Sexo
const createSexo = async ({nombre}) => {
    try {
        const response = await Sexo.create({ nombre });
        return response

    } catch (error) {
        console.error('Error al crear una nueva Sexo',error)
        return false
    }
};
//elimina la Sexo o canbia el estado
const deleteSexo = async (id) => {
    try {
        const response = await Sexo.findByPk(id);
        response.state = false;
        await response.save();
       return response || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Sexo');
        return false;
    }
};


const updateSexo = async (id, nuevaSexo) => {
    if (id && nuevaSexo)
        try {
            const response = await getSexo(id);

            if (response) 
                await response.update(nuevaSexo);
            
                return response || null;
           
        } catch (error) {
            console.error('Error al actualizar la Sexo:', error.message);
            return false;
        }
    else
        return false;
};  



module.exports = {
    getSexos,
    createSexo,
    getSexo,
    updateSexo,
    deleteSexo
};