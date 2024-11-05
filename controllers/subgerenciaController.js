const {Subgerencia} = require('../db_connection');

//Trae todas las Subgerencias
const getSubgerencias=async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit; 
    try {
        const  { count, rows }=await Subgerencia.findAndCountAll({
            where: { state: true },
            limit,
            offset
        });
        return { totalCount: count, data: rows , currentPage:page } || null;
    } catch (error) {
        console.error('Error al Obtener todas las Subgerencias',error);
        return false
    }
}

//trae una Subgerencia especifica por id
const getSubgerencia = async (id) => { 
    try {
        const newSubgerencia = await Subgerencia.findOne({where: {
            id ,
           
        }});
        return newSubgerencia || null;
    } catch (error) {
        console.error(`Error al obtener la Subgerencia: ${error.message}`);
      return false
    }
};
//Crea una nueva Subgerencia
const createSubgerencia = async ({nombre}) => {
    try {
        const newSubgerencia = await Subgerencia.create({ nombre });
        return newSubgerencia

    } catch (error) {
        console.error('Error al crear una nueva Subgerencia',error)
        return false
    }
};
//elimina la Subgerencia o canbia el estado
const deleteSubgerencia = async (id) => {
    try {
        const newSubgerencia = await Subgerencia.findByPk(id);
        newSubgerencia.state = false;
        await newSubgerencia.save();
       return newSubgerencia || null
    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Subgerencia');
        return false;
    }
};


const updateSubgerencia = async (id, nuevaSubgerencia) => {
    if (id && nuevaSubgerencia)
        try {
            const newSubgerencia = await Subgerencia.findOne({ where: { id } });
            if (newSubgerencia) 
                await newSubgerencia.update(nuevaSubgerencia);
                return newSubgerencia || null ;
           
        } catch (error) {
            console.error('Error al actualizar la Subgerencia:', error.message);
            return false;
        }
    else
        return false;
};  



module.exports = {
    getSubgerencias,
    createSubgerencia,
    getSubgerencia,
    updateSubgerencia,
    deleteSubgerencia
};