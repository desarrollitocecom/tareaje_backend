const { Empleado, Cargo, Usuario, RegimenLaboral, Sexo,
    Jurisdiccion, GradoEstudios, LugarTrabajo, Subgerencia, Turno } = require('../db_connection');



const getAllEmpleados = async () => {
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
        const response = await Empleado.findOne({
            attributes: ['nombres', 'apellidos', 'dni',
                'ruc', 'hijos', 'edad', 'f_nacimiento', 'correo', 'domicilio',
                'celular', 'f_inicio', 'observaciones', 'foto'],
            where: {
                state: true
            },
            include: [
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Turno, as: 'turno', attributes: ['nombre'] },
                { model: RegimenLaboral, as: 'regimenLaboral', attributes: ['nombre'] },
                { model: Sexo, as: 'sexo', attributes: ['nombre'] },
                { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
                { model: Jurisdiccion, as: 'jurisdiccion', attributes: ['nombre'] },
                { model: LugarTrabajo, as: 'lugarTrabajo', attributes: ['nombre'] },
                { model: GradoEstudios, as: 'gradoEstudios', attributes: ['nombre'] },
            ]

        });
        return response || null
    } catch (error) {
        console.error("Error al obtener un empleado en el controlador:", error);
        return false;
    }
}

const createEmpleado = async ({
    nombres, apellidos, dni, ruc, hijos, edad,
    f_nacimiento, correo, domicilio, celular, f_inicio, foto, observaciones,
    id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
    id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
}) => {
    try {
        const response = await Empleado.create({
            nombres,
            apellidos,
            dni,
            ruc,
            hijos,
            edad,
            f_nacimiento,
            correo,
            domicilio,
            celular,
            f_inicio,
            foto,
            observaciones,
            id_cargo,
            id_turno,
            id_regimen_laboral,
            id_sexo,
            id_jurisdiccion,
            id_grado_estudios,
            id_subgerencia,
            id_funcion,
            id_lugar_trabajo
        });
        return response || null;
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        return false;
    }
};
const deleteEmpleado = async (id) => {
    try {
        const response = await Empleado.findByPk(id);
        response.state = false;
        await response.save();
        return response || null;

    } catch (error) {
        console.error('Error al canbiar de estado al eliminar Eliminar');
        return false;
    }

};
const updateEmpleado = async ({
    id, nombres, apellidos, dni, ruc, hijos, edad,
    f_nacimiento, correo, domicilio, celular, f_inicio, foto, observaciones,
    id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
    id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
}) => {
    try {
        const response = await getEmpleado(id);
        if (response) await response.update(nombres, apellidos, dni, ruc, hijos, edad,
            f_nacimiento, correo, domicilio, celular, f_inicio, foto, observaciones,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo);
        return response || null;

    } catch (error) {
        console.error('Error al canbiar de estado al modificar Eliminar');
        return false;
    }};
module.exports = {
    getAllEmpleados,
    getEmpleado,
    createEmpleado,
    deleteEmpleado,
    updateEmpleado
};