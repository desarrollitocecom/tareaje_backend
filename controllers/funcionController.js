const {Funcion} = require('../db_connection');

//Trae todas las funciones y las pagina 
const getFunciones = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit; // Cálculo del offset
    try {
        const { count, rows } = await Funcion.findAndCountAll({
            limit,
            offset
        });
        return { total: count, data: rows } || null;
    } catch (error) {
        console.error('Error al obtener todas las funciones', error);
        return false;
    }
};
//trae una funcion especifica por id
const getFuncion = async (id) => {
    try {
        const funcion = await Funcion.findOne({where: {
            id,
            state:true
        }});

        return funcion || null;
    } catch (error) {
        console.error(`Error al obtener la Función: ${error.message}`);
      return false
    }
};
//Crea una nueva Funcion
const createFuncion = async ({nombre}) => {
    try {
        const funcion = await Funcion.create({ nombre });
        return funcion

    } catch (error) {
        console.error('Error al crear una nueva Funcion',error)
        return false
    }
};
//elimina la funcion o canbia el estado
const deleteFuncion = async (id) => {
    try {
        const funcion = await Funcion.findByPk(id);
        funcion.state = false;
        await funcion.save();
       return funcion || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Funcion');
        return false;
    }
};


const updateFuncion = async (id, nuevaFuncion) => {
    if (id && nuevaFuncion)
        try {
            const funcion = await getFuncion(id);
            if (funcion) 
                await funcion.update(nuevaFuncion);
                return funcion || null ;
           
        } catch (error) {
            console.error('Error al actualizar la funcion:', error.message);
            return false;
        }
    else
        return false;
};  



module.exports = {
    getFunciones,
    createFuncion,
    getFuncion,
    updateFuncion,
    deleteFuncion
};