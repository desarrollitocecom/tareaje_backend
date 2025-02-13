const {
    getPreguntasDISC,
    calculateDISC,
    createPatronDISC,
    getPatronDISC,
    getRespuestasDISC,
    createResultadosDISC,
    getResultadosDISC,
    evaluateResultadosDISC
} = require('../controllers/pruebasController');

// Handler para obtener todas las preguntas de la prueba psicológica :
const getPreguntasDISCHandler = async (req, res) => {
    
    try {
        const response = await getPreguntasDISC();
        if (!response) return res.status(400).json({
            message: 'No se pudieron obtener las preguntas...',
            data: []
        });

        return res.status(200).json({
            message: 'Preguntas obtenidas exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener todas las preguntas de la prueba psicológica',
            error: error.message
        });
    }
};

// Handler para crear los resultados finales de un postulante en la prueba psicológica :
const rendirPruebaDISCHandler = async (req, res) => {

    const { id, respuestas } = req.body;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (!Array.isArray(respuestas) || respuestas.length === 0) errores.push('El campo respuestas debe ser un array con al menos un elemento.');
    else respuestas.forEach((respuesta, i) => {
        const { grupo, max, min } = respuesta;
        if (!grupo || isNaN(grupo) || grupo <= 0) errores.push(`Error en respuesta ${i + 1}: Grupo inválido.`);
        if (!max || isNaN(max) || max <= 0) errores.push(`Error en respuesta ${i + 1}: "max" debe ser un número válido.`);
        if (!min || isNaN(min) || min <= 0) errores.push(`Error en respuesta ${i + 1}: "min" debe ser un número válido.`);
        if (max === min) errores.push(`Error en respuesta ${i + 1}: "max" y "min" no pueden ser iguales.`);
    });

    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const patron = await calculateDISC(respuestas);
        if (!patron) return res.status(400).json({
            message: 'Error interno 01 al rendir la prueba psicológica',
            success: false
        });

        const id_patron = await getPatronDISC(patron);
        if (!id_patron) return res.status(400).json({
            message: 'Error interno 02 al rendir la prueba psicológica',
            success: false
        });

        const r = await getRespuestasDISC(id_patron);
        if (!r) return res.status(400).json({
            message: 'Error interno 03 al rendir la prueba psicológica',
            success: false
        });

        const response = await createResultadosDISC(respuestas, r.E, r.M, r.J, r.I, r.S, r.A, r.B, r.T, r.SE, r.O1, r.O2, r.O3, id);
        if (!response) return res.status(400).json({
            message: 'Error interno 04 al rendir la prueba psicológica',
            success: false
        });

        return res.status(200).json({
            message: 'Prueba psicológica rendida exitosamente...',
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error total interno al rendir la prueba psicológica',
            error: error.message
        });
    }
};

// Handler para obtener los resultados finales de un postulante en la prueba psicológica :
const getResultadosDISCHandler = async (req, res) => {
    
    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await getResultadosDISC(id);
        if (!response) return res.status(404).json({
            message: 'Resultados finales del postulante no encontrados',
            data: []
        });

        return res.status(200).json({
            message: 'Resultados finales del postulante en la prueba psicológica obtenidos exitosamente...',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al obtener los resultados finales de un postulante en la prueba psicológica',
            error: error.message
        });
    }
};

// Handler para evaluar la prueba psicológica de un postulante (Apto o No Apto) :
const evaluateResultadosDISCHandler = async (req, res) => {
    
    const { id } = req.params;
    const errores = [];

    if (!id) errores.push('El parámetro ID es obligatorio');
    if (isNaN(id)) errores.push('El ID debe ser un entero');
    if (typeof estado !== 'boolean') errores.push('El estado debe ser un valor booleano');
    if (errores.length > 0) return res.status(400).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await evaluateResultadosDISC(id, estado);
        if (!response) return res.status(404).json({
            message: 'Resultados finales del postulante no encontrados',
            data: []
        });

        return res.status(200).json({
            message: 'Evaluación exitosa...',
            data: response
        });

    } catch (error) {
        console.error({
            message: 'Error en el controlador al evaluar los resultados finales de un postulante en la prueba psicológica',
            error: error.message 
        });
        return false;
    }
};

// Handler para crear un patrón (provisional por la gran cantidad de patrones) :
const createPatronDISCHandler = async (req, res) => {
    
    const { patron, id_respuesta } = req.body;
    const errores = [];

    if (!patron) errores.push('El patrón es obligatorio');
    if (isNaN(patron)) errores.push('El patrón debe ser un entero');
    if (!id_respuesta) errores.push('El ID de respuesta es obligatorio');
    if (isNaN(id_respuesta)) errores.push('El ID de respuesta debe ser un entero');

    if (errores.length > 0) return res.status(200).json({
        message: 'Se encontraron los siguientes errores...',
        data: errores,
    });

    try {
        const response = await createPatronDISC(patron, id_respuesta);
        if (!response) return res.status(200).json({
            message: 'No se pudo crear el patrón',
            data: []
        });

        return res.status(200).json({
            message: 'Patron creado',
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno al crear el patrón de la prueba psicológica',
            error: error.message
        });
    }
};

module.exports = {
    getPreguntasDISCHandler,
    rendirPruebaDISCHandler,
    getResultadosDISCHandler,
    evaluateResultadosDISCHandler,
    createPatronDISCHandler,
};