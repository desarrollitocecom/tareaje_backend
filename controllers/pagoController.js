const { Pago } = require('../db_connection');

// Obtener la información de pago de un empleado : 
const getPago = async (id_empleado) => {

    try {
        const response = await Pago.findOne({
            where: { id_empleado: id_empleado }
        });
        return response || null;

    } catch (error) {
        console.error('Error al obtener el pago por ID:', error);
        return false;
    }
};

// Obtener todas los datos de información de pagos de los empleados :
const getAllPagos = async (page = 1, limit = 20) => {

    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    try {
        const response = await Pago.findAndCountAll({
            where: { state: true },
            limit,
            offset,
        });
        return {
            totalCount: response.count,
            data: response.rows,
            currentPage: page
        } || null;

    } catch (error) {
        console.error({ message: "Error al obtener todos los pagos:", data: error });
        return false
    }
};

// Crear la información de pago del empleado :
const createPago = async (carasDni, cci, certiAdulto, claveSol, suspension, id_empleado) => {

    try {
        const response = await Pago.create({ carasDni, cci, certiAdulto, claveSol, suspension, id_empleado });
        return response || null;

    } catch (error) {
        console.error('Error al crear una nuevo pago:', error)
        return false
    }
};

// Actualizar la información de pago del empleado :
const updatePago = async (carasDni, cci, certiAdulto, claveSol, suspension, id_empleado) => {
    
    try {
        const response = await Pago.findOne({
            where: { id_empleado: id_empleado }
        });
        if (response) await response.update({ carasDni, cci, certiAdulto, claveSol, suspension });
        return response || null;

    } catch (error) {
        console.error('Error al actualizar el pago:', error.message);
        return false;
    }
};

// Actualizar algunos campos de pagos :
const updateInfoPago = async (cci, certiAdulto, claveSol, id_empleado) => {
    
    try {
        const response = await Pago.findOne({
            where: { id_empleado: id_empleado }
        });
        if (response) await response.update({ cci, certiAdulto, claveSol});
        return response || null;

    } catch (error) {
        console.error('Error al actualizar el pago:', error.message);
        return false;
    }
};

module.exports = {
    getPago,
    getAllPagos,
    createPago,
    updatePago,
    updateInfoPago
};