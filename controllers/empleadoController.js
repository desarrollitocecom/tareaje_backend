const { Empleado, Cargo, Usuario, RegimenLaboral, Sexo,
    Jurisdiccion, GradoEstudios, LugarTrabajo, Subgerencia, Turno } = require('../db_connection');



const getAllEmpleados = async (page=1,limit=20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await Empleado.findAndCountAll({
            attributes: ['nombres', 'apellidos', 'dni'],
            include: [
                { model: Cargo, as: 'cargo', attributes: ['nombre'] },
                { model: Subgerencia, as: 'subgerencia', attributes: ['nombre'] },
                { model: Turno, as: 'turno', attributes: ['nombre'] }
            ],
            limit,
            offset
        });
        return { total: response.count, data: response.rows } || null;
    } catch (error) {
        console.error("Error al obtener todos los empleados:", error);
        return false;
    }
};

    const getEmpleado = async (id) => {
        try {
            const response = await Empleado.findOne({
                attributes: ['id','nombres', 'apellidos', 'dni',
                    'ruc', 'hijos', 'edad', 'f_nacimiento', 'correo', 'domicilio',
                    'celular', 'f_inicio', 'observaciones', 'foto'],
                where: {id},
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
            if (!response) return null;
            const estado = response.state ? "Trabajando" : "Cesado";
            return {...response.toJSON() , estado }
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
const updateEmpleado = async (
    id,
    {
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
      id_lugar_trabajo,
    }
  ) => {
    try {
      const empleado = await getEmpleado(id);
      if (empleado) {
        await empleado.update({
          nombres:nombres,
          apellidos: apellidos,
          dni:dni,
          ruc: ruc,
          hijos: hijos,
          edad:edad,
          f_nacimiento:f_nacimiento,
          correo:correo,
          domicilio:domicilio,
          celular:celular,
          f_inicio:f_inicio,
          foto:foto,
          observaciones:observaciones,
          id_cargo:id_cargo,
          id_turno:id_turno,
          id_regimen_laboral:id_regimen_laboral,
          id_sexo:id_sexo,
          id_jurisdiccion:id_jurisdiccion,
          id_grado_estudios:id_grado_estudios,
          id_subgerencia:id_subgerencia,
          id_funcion:id_funcion,
          id_lugar_trabajo:id_lugar_trabajo,
        });
      }
      return empleado || null;
    } catch (error) {
      console.error("Error al modificar el empleado en el controlador:", error);
      return false;
    }
  };
module.exports = {
    getAllEmpleados,
    getEmpleado,
    createEmpleado,
    deleteEmpleado,
    updateEmpleado
};