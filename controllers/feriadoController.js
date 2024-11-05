const {Feriado} = require('../db_connection');

//Trae todas las Feriadoes y las pagina 
const getAllFeriados = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit; // Cálculo del offset
    try {
        const { count, rows } = await Feriado.findAndCountAll({
            where: { state: true },
            limit,
            offset
        });
        return { totalCount: count, data: rows ,currentPage:page} || null;
    } catch (error) {
        console.error('Error al obtener todas las Feriados', error);
        return false;
    }
};
//trae una Feriado especifica por id
const getFeriado = async (id) => {
    try {
        const feriado = await Feriado.findOne({where: {
            id,
            state:true
        }});

        return feriado || null;
    } catch (error) {
        console.error(`Error al obtener el Feriado: ${error.message}`);
      return false
    }
};
//Crea una nueva Feriado
const createFeriado = async ({nombre,fecha}) => {
    try {
        const feriado = await Feriado.create({ nombre , fecha });
        return feriado || null

    } catch (error) {
        console.error('Error al crear una nueva Feriado',error)
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


const updateFeriado = async (id, {nombre,fecha}) => {
    if (id)
        try {
            const feriado = await getFeriado(id);
            if (feriado) 
                await feriado.update({nombre,fecha});
                return feriado || null ;
           
        } catch (error) {
            console.error('Error al actualizar la Feriado:', error.message);
            return false;
        }
    else
        return false;
};  



module.exports = {
    getAllFeriados,
    createFeriado,
    getFeriado,
    updateFeriado,
    deleteFeriado
};