const { getAllEmpleados, getEmpleado, createEmpleado,
    updateEmpleado, deleteEmpleado } = require('../controllers/empleadoController');

const getAllEmpleadosHandlers = async (req, res) => {
    const { page, limit } = req.query;
    try {
        const response = await getAllEmpleados(Number(page), Number(limit)); // Llamamos a la función getEmpleados
        console.log(response);
        if (!response) return res.status(200).json(
            {
                message: 'No se encontraron Empleados',
                data: {}
            }
        )

        return res.status(200).json({
            message: "Empleados obtenidos correctamente",
            total: response.total,
            data: response.data,
        })
    } catch (error) {
        console.error("Error al obtener empleados:", error); // Log para debugging
        res.status(500).json({ error: "Error interno del servidor al obtener los empleados." });
    }
};

const getEmpleadoHandler = async (req, res) => {
    const { id } = req.params
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await getEmpleado(id);
        if (!response) {
            return res.status(200).json({
                message: 'No se encuentra el empleado',
                data: {}
            })
        };
        return res.status(201).json({
            message: 'Enpleado encontrado',
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el empleado." });
    }
};
const createEmpleadoHandler = async (req, res) => {
    const {
        nombres, apellidos, dni, ruc, hijos, edad,
        f_nacimiento, correo, domicilio, celular, f_inicio, foto, observaciones,
        id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
        id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
    } = req.body;
    const errores = [];
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,30}$/.test(nombres))
        errores.push("Nombres deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,30}$/.test(apellidos))
        errores.push("Apellidos deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^\d{8}$/.test(dni))
        errores.push("DNI debe tener exactamente 8 dígitos");
    if (!/^\d{11}$/.test(ruc))
        errores.push("RUC debe tener exactamente 11 dígitos");
    if (isNaN(hijos))
        errores.push("Número de hijos debe ser un número entero positivo");
    if (isNaN(edad) || edad < 0 || edad > 120)
        errores.push("Edad debe ser un número entre 0 y 120 años");
    if (!Date.parse(f_nacimiento))
        errores.push("Fecha de nacimiento debe tener el formato YYYY - MM - DD");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
        errores.push("Correo electrónico no válido");
    if (!domicilio || domicilio.length < 5) {
        errores.push("Domicilio debe tener al menos 5 caracteres");
    }
    if (!/^\d{9}$/.test(celular))
        errores.push("Número de celular debe tener entre 9 y 15 dígitos");
    if (!Date.parse(f_inicio))
        errores.push("Fecha de inicio debe tener el formato YYYY-MM-DD");
    if (!foto || typeof foto !== 'string')
        errores.push("Foto incorrecta")
    if (observaciones && observaciones.length > 200)
        errores.push("Observaciones no pueden exceder 200 caracteres");
    if (!id_cargo || isNaN(id_cargo))
        errores.push('El id del cargo es requerido y debe ser un Numero')
    if (!id_turno || isNaN(id_turno))
        errores.push('El id del turno es requerido y debe ser un Numero')
    if (!id_regimen_laboral || isNaN(id_regimen_laboral))
        errores.push('El id del regimen laboral es requerido y debe ser un Numero')
    if (!id_sexo || isNaN(id_sexo))
        errores.push('El id sexo es requerido y debe ser un Numero')
    if (!id_jurisdiccion || isNaN(id_jurisdiccion))
        errores.push('El id jurisdiccion es requerido y debe ser un Numero')
    if (!id_grado_estudios || isNaN(id_grado_estudios))
        errores.push('El id grado estudios es requerido y debe ser un Numero')
    if (!id_subgerencia || isNaN(id_subgerencia))
        errores.push('El id de la sungerencia es requerido y debe ser un Numero')
    if (!id_funcion || isNaN(id_funcion))
        errores.push('El id de la funcion es requerido y debe ser un Numero')
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo))
        errores.push('El id del lugar trabajo es requerido y debe ser un Numero')

    if (errores.length > 0)
        return res.status(400).json({ errores });
    try {
        const newEmpleado = await createEmpleado({
            nombres, apellidos, dni, ruc, hijos, edad,
            f_nacimiento, correo, domicilio, celular, f_inicio, foto, observaciones,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
        });
        if (!newEmpleado) return res.status(200).json({ message: 'No se encuentra empleado', data: [] })
        return res.status(200).json({ message: 'Nuevo Empleado Creado', data: newEmpleado })
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al Crear el empleado." });
    }
};
const updateEmpleadoHandler = async (req, res) => {
    const { id } = req.params;
    const {
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
    } = req.body;


    const errores = [];
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,30}$/.test(nombres))
        errores.push("Nombres deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,30}$/.test(apellidos))
        errores.push("Apellidos deben contener solo letras y tener entre 2 y 50 caracteres");
    if (!/^\d{8}$/.test(dni))
        errores.push("DNI debe tener exactamente 8 dígitos");
    if (!/^\d{11}$/.test(ruc))
        errores.push("RUC debe tener exactamente 11 dígitos");
    if (isNaN(hijos))
        errores.push("Número de hijos debe ser un número entero positivo");
    if (isNaN(edad) || edad < 0 || edad > 120)
        errores.push("Edad debe ser un número entre 0 y 120 años");
    if (!Date.parse(f_nacimiento))
        errores.push("Fecha de nacimiento debe tener el formato YYYY - MM - DD");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
        errores.push("Correo electrónico no válido");
    if (!domicilio || domicilio.length < 5) {
        errores.push("Domicilio debe tener al menos 5 caracteres");
    }
    if (!/^\d{9}$/.test(celular))
        errores.push("Número de celular debe tener entre 9 y 15 dígitos");
    if (!Date.parse(f_inicio))
        errores.push("Fecha de inicio debe tener el formato YYYY-MM-DD");
    if (!foto || typeof foto !== 'string')
        errores.push("Foto incorrecta")
    if (observaciones && observaciones.length > 200)
        errores.push("Observaciones no pueden exceder 200 caracteres");
    if (!id_cargo || isNaN(id_cargo))
        errores.push('El id del cargo es requerido y debe ser un Numero')
    if (!id_turno || isNaN(id_turno))
        errores.push('El id del turno es requerido y debe ser un Numero')
    if (!id_regimen_laboral || isNaN(id_regimen_laboral))
        errores.push('El id del regimen laboral es requerido y debe ser un Numero')
    if (!id_sexo || isNaN(id_sexo))
        errores.push('El id sexo es requerido y debe ser un Numero')
    if (!id_jurisdiccion || isNaN(id_jurisdiccion))
        errores.push('El id jurisdiccion es requerido y debe ser un Numero')
    if (!id_grado_estudios || isNaN(id_grado_estudios))
        errores.push('El id grado estudios es requerido y debe ser un Numero')
    if (!id_subgerencia || isNaN(id_subgerencia))
        errores.push('El id de la sungerencia es requerido y debe ser un Numero')
    if (!id_funcion || isNaN(id_funcion))
        errores.push('El id de la funcion es requerido y debe ser un Numero')
    if (!id_lugar_trabajo || isNaN(id_lugar_trabajo))
        errores.push('El id del lugar trabajo es requerido y debe ser un Numero')

    if (errores.length > 0)
        return res.status(400).json({ errores });
    try {
        const response = await updateEmpleado(id, {
            nombres, apellidos, dni, ruc, hijos, edad,
            f_nacimiento, correo, domicilio, celular, f_inicio, foto, observaciones,
            id_cargo, id_turno, id_regimen_laboral, id_sexo, id_jurisdiccion,
            id_grado_estudios, id_subgerencia, id_funcion, id_lugar_trabajo
        });
        if (!response) return res.status(404).json({ message: 'Empleado no encontrado', data: {} });
        return res.status(200).json({ message: 'Empleado Mopdificado', data: response });
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al Crear el empleado." });
    }
};
const deleteEmpleadoHandler = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'El ID es requerido y debe ser un Numero' });
    }
    try {
        const response = await deleteEmpleado(id);
        if (!response) return res.status(200).json({ message: 'Empleado no encontrado', data: {} });
        return res.status(200).json({ message: 'Función eliminada correctamente (estado cambiado a inactivo)' },)
    } catch (error) {
        console.error("Error al eliminar el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el empleado." });

    }

}
module.exports = {
    getAllEmpleadosHandlers,
    getEmpleadoHandler,
    createEmpleadoHandler,
    updateEmpleadoHandler,
    deleteEmpleadoHandler
};