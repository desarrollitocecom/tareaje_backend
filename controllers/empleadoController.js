
const { sequelize } = require('../db_connection');
const Empleado = require('../models/Empleado');
const Cargo = require('../models/Cargo');
const Usuario = require('../models/Usuario');
const Turno = require('../models/Turno');
const RegimenLaboral = require('../models/RegimenLaboral');
const Sexo = require('../models/Sexo');
const Jurisdiccion = require('../models/Jurisdiccion');
const GradoEstudios = require('../models/GradoEstudios');
const Subgerencia = require('../models/Subgerencia');
const Funcion = require('../models/Funcion');

const getEmpleados = async () => {
    try {
        const response = await Empleado(sequelize).findAll({
            where: { state: true },
            include: [
                { model: Cargo(sequelize), as: 'cargo' },
                { model: Usuario(sequelize), as: 'id_usuario' },
                { model: Turno(sequelize), as: 'turno' },
                { model: RegimenLaboral(sequelize), as: 'regimenLaboral' },
                { model: Sexo(sequelize), as: 'sexo' },
                { model: Jurisdiccion(sequelize), as: 'jurisdiccion' },
                { model: GradoEstudios(sequelize), as: 'gradoEstudios' },
                { model: Subgerencia(sequelize), as: 'subgerencia' },
                { model: Funcion(sequelize), as: 'funcion' }
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
        const response=await 
    } catch (error) {
        
    }
}*/

module.exports = {
    getEmpleados
};