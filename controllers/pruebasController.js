const { PruebaPregunta, PruebaRespuesta, PruebaPatron, ResultadoPsicologia } = require('../db_connection');

// Obtener todas las preguntas de la prueba psicológica :
const getPreguntasDISC = async () => {
    
    try {
        const response = await PruebaPregunta.findAll({
            order: [
                ['grupo', 'ASC'],
                ['id_por_grupo', 'ASC']
            ],
            raw: true
        });
        if (!response) return null;

        // Agrupar las preguntas por grupo :
        const result = response.reduce((acc, r) => {
            const { grupo, id_por_grupo, pregunta } = r;
            if (!acc[grupo]) acc[grupo] = [];
            acc[grupo].push({ id_por_grupo, pregunta });
            return acc;
        }, {});

        return result;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener todas las preguntas del DISC',
            error: error.message
        });
        return false;
    }
};

// Calcular el puntaje DISC :
const calculateDISC = async (respuestas) => {
    
    try {
        const response = await PruebaPregunta.findAll({
            order: [
                ['grupo', 'ASC'],
                ['id_por_grupo', 'ASC']
            ],
            raw: true
        });
        if (!response) return null;

        let Dmax = 0, Imax = 0, Smax = 0, Cmax = 0, Nmax = 0;
        let Dmin = 0, Imin = 0, Smin = 0, Cmin = 0, Nmin = 0;

        for (const resp of respuestas) {

            const grupo = response.filter(r => r.grupo === resp.grupo);
            const max = grupo.find(g => g.id_por_grupo === resp.max).max_state;
            const min = grupo.find(g => g.id_por_grupo === resp.min).min_state;

            if (max === 'D') Dmax ++;
            else if (max === 'I') Imax ++;
            else if (max === 'S') Smax ++;
            else if (max === 'C') Cmax ++;
            else Nmax ++;

            if (min === 'D') Dmin ++;
            else if (min === 'I') Imin ++;
            else if (min === 'S') Smin ++;
            else if (min === 'C') Cmin ++;
            else Nmin ++;
        }

        if (Dmax + Imax + Smax + Cmax + Nmax !== 28) return false;
        if (Dmin + Imin + Smin + Cmin + Nmin !== 28) return false;

        const D = Dmax - Dmin;
        const I = Imax - Imin;
        const S = Smax - Smin;
        const C = Cmax - Cmin;

        const patron1 = (D < -7) ? 1 :
            (D < -3 && D > -8) ? 2 :
            (D < 0 && D > -4) ? 3 :
            (D < 2 && D > -1) ? 4 :
            (D > 1 && D < 5) ? 5 :
            (D > 4 && D < 9) ? 6 :
            (D > 8) ? 7 : null;
        
        const patron2 = (I < -7) ? 1 :
            (I < -3 && I > -8) ? 2 :
            (I < -1 && I > -4) ? 3 :
            (I < 2 && I > -2) ? 4 :
            (I > 1 && I < 4) ? 5 :
            (I > 3 && I < 7) ? 6 :
            (I > 6) ? 7 : null;

        const patron3 = (S < -10) ? 1 :
            (S < -6 && S > -11) ? 2 :
            (S < -3 && S > -7) ? 3 :
            (S < 0 && S > -4) ? 4 :
            (S > -1 && S < 3) ? 5 :
            (S > 2 && S < 8) ? 6 :
            (S > 7) ? 7 : null;

        const patron4 = (C < -5) ? 1 :
            (C < -2 && C > -6) ? 2 :
            (C < 0 && C > -3) ? 3 :
            (C < 3 && C > -1) ? 4 :
            (C > 2 && C < 5) ? 5 :
            (C > 4 && C < 9) ? 6 :
            (C > 8) ? 7 : null;

        if (!patron1 || !patron2 || !patron3 || !patron4) return false;
        const patron = patron1 * 1000 + patron2 * 100 + patron3 * 10 + patron4;
        return patron;
        
    } catch (error) {
        console.error({
            message: 'Error en el controlador al calcular el puntaje DISC',
            error: error.message
        });
        return false;
    }
};

// Crear los patrones (provisional debido a la gran cantidad de patrones) :
const createPatronDISC = async (patron, id_respuesta) => {
    
    try {
        const response = await PruebaPatron.create({ patron, id_respuesta });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear el patrón de la prueba psicológica',
            error: error.message
        });
        return false;
    }
};

// Obtener el ID de las respuestas finales de la prueba psicológica :
const getPatronDISC = async (patron) => {
    
    try {
        const response = await PruebaPatron.findOne({
            where: { patron },
            raw: true
        });
        if (!response || response.length === 0) return null;
        return response.id_respuesta;

    } catch (error) {
        console.error({
           message: 'Error en el controlador al obtener el ID de las respuestas finales de la prueba psicológica',
           error: error.message 
        });
        return false;
    }
};

// Actualizar las respuestas finales de la prueba psicológica (provisional por la gran cantidad de información) :
const updateRespuestasDISC = async (id, nombre, E, M, J, I, S, A, B, T, SE, O1, O2, O3) => {
    
    try {
        const response = await PruebaRespuesta.findByPk(id);
        if (response) await response.update({ nombre, E, M, J, I, S, A, B, T, SE, O1, O2, O3 });
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al actualizar las respuestas finales de la prueba psicológica',
            error: error.message 
        });
        return false;
    }
};

// Obtener las respuestas finales de la prueba psicológica :
const getRespuestasDISC = async (id) => {
    
    try {
        const response = await PruebaRespuesta.findByPk(id);
        return response || null;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener las respuestas finales de la prueba psicológica',
            error: error.message 
        });
        return false;
    }
};

// Crear los resultados finales de la prueba psicológica para su posterior evaluación :
const createResultadosDISC = async (respuestas, id_prueba, id_postulante) => {
    
    try {
        const response = await ResultadoPsicologia.create({ respuestas, id_prueba, id_postulante });
        return response || null;
        
    } catch (error) {
        console.error({
            message: 'Error en el controlador al crear los resultados finales de la prueba psicológica',
            error: error.message
        });
        return false;
    }
};

// Obtener los resultados finales de un postulante en la prueba psicológica para su evaluación :
const getResultadosDISC = async (id_postulante) => {
    
    try {
        const response = await ResultadoPsicologia.findOne({
            where: { id_postulante },
            include: [{ model: PruebaRespuesta, as: 'prueba' }]
        });
        return response || null;
        
    } catch (error) {
        console.error({
            message: 'Error en el controlador al obtener los resultados finales de un postulante en la prueba psicológica',
            error: error.message 
        });
        return false;
    }
};

// Evaluar la prueba psicológica de un postulante (Apto o No Apto) :
const evaluateResultadosDISC = async (id_postulante, estado) => {
    
    try {
        const response = await ResultadoPsicologia.findOne({
            where: { id_postulante }
        });
        if (!response) return null;
        response.state_accept = estado;
        response.save();
        return response;

    } catch (error) {
        console.error({
            message: 'Error en el controlador al evaluar los resultados finales de un postulante en la prueba psicológica',
            error: error.message
        });
        return false;
    }
};

module.exports = {
    getPreguntasDISC,
    calculateDISC,
    createPatronDISC,
    getPatronDISC,
    updateRespuestasDISC,
    getRespuestasDISC,
    createResultadosDISC,
    getResultadosDISC,
    evaluateResultadosDISC
};