const { getSeguimiento } = require('../controllers/segumientoController');

// Handler para obtener el seguimiento del personal por rango de fechas :
const getSeguimientoHandler = async (req, res) => {

    const { inicio, fin } = req.body;
    const { page = 1, limit = 20, search, dni, cargo, turno, regimen, sexo, jurisdiccion, grado, subgerencia, lugar, funcion, area, state } = req.query;
    const filters = { search, dni, cargo, turno, regimen, sexo, jurisdiccion, grado, subgerencia, lugar, funcion, area, state };
    const errores = [];

    if (isNaN(page)) errores.push('El page debe ser un número entero...');
    if (page < 0) errores.push('El page debe ser mayor que cero...');
    if (isNaN(limit)) errores.push('El limit debe ser un número entero...');
    if (limit <= 0) errores.push('El limit debe ser mayor que cero...');
    if (!inicio) errores.push('La fecha de inicio es obligatoria...');
    if (!fin) errores.push('La fecha de fin es obligatoria...');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio)) errores.push('El formato para INICIO es incorrecto, debe ser YYYY-MM-HH)');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fin)) errores.push('El formato para FIN es incorrecto, debe ser YYYY-MM-HH');
    if (errores.length > 0) return res.status(400).json({ errores });

    const numPage = parseInt(page);
    const numLimit = parseInt(limit);

    try {
        const response = await getSeguimiento(numPage, numLimit, inicio, fin, filters);
        const totalPages = Math.ceil(response.totalCount / numLimit);

        if (numPage > totalPages) return res.status(200).json({
            message: 'Página fuera de rango...',
            data: {
                data: [],
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

        return res.status(200).json({
            message: `Mostrando el seguimiento del personal del ${inicio} al ${fin}`,
            data: {
                data: response.data,
                currentPage: numPage,
                pageCount: response.data.length,
                totalCount: response.totalCount,
                totalPages: totalPages,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en interno al obtener el seguimiento del personal',
            error: error.message
        });
    }
};

module.exports = { getSeguimientoHandler };
