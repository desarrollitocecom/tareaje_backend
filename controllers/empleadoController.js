
const {Empleado,Cargo,Usuario,RegimenLaboral,Sexo,
    Jurisdiccion,GradoEstudios,Funcion,Subgerencia}=require('../db_connection');



const getEmpleados = async () => {
    try {
        const response = await Empleado.findAll({
            where: { state: true },
            include: [
              
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            //     { model: Usuario, as: 'id_usuario' },
            //     { model: Turno, as: 'turno' },
            //     { model: RegimenLaboral, as: 'regimenLaboral' },
            //     { model: Sexo, as: 'sexo' },
            //     { model: Jurisdiccion, as: 'jurisdiccion' },
            //     { model: GradoEstudios, as: 'gradoEstudios' },
            //     { model: Subgerencia, as: 'subgerencia' },
            //     { model: Funcion, as: 'funcion' }
            ]
        });
        return response || null;
    } catch (error) {
        console.error("Error al obtener todos los empleados:", error);
        return false;
    }
};

const getEmpleado = async (id) => {
    try {

    } catch (error) {

    }
}
/*
const createEmpleado=async (id) => {
    try {
       
    } catch (error) {
        
    }
}*/

module.exports = {
    getEmpleados
};