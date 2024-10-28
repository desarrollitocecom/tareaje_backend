
const { where } = require('sequelize');
const { Empleado, Cargo, Usuario, RegimenLaboral, Sexo,
    Jurisdiccion, GradoEstudios, Funcion, Subgerencia, Turno } = require('../db_connection');



const getEmpleados = async () => {
    try {
        const response = await Empleado.findAll({
            attributes: ['nombres', 'apellidos', 'dni'],
            where: {
                state: true
            },
            include: [
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
                { model: Turno, as: 'turno', attributes: ['nombre'] }
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
        const response = await Empleado.finOne({
          attributes:['nombres','apellidos','dni','ruc'],
          where:{
            state:true
          },
          include:[
            { model: Cargo, as: 'cargo', attributes: ['nombre'] },
            { model: Turno, as: 'turno', attributes: ['nombre'] },
            { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] },
            { model: Sexo, as: 'sexo', attributes: ['nombre'] },
            
 
          ]

        })
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