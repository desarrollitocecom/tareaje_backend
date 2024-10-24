const { createFuncion, readFuncion, UpdateFuncion, deleteFuncion } = require('../controllers/ControllersFuncion');

const CrearFuncionHander = async (req, res) => {
    const { nombre } = req.body;
    
    if (!nombre || typeof nombre !== 'string')
        return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena de texto válida' });
    try {
        const nuevofuncion=await createFuncion({nombre})
      
        res.status(201).json(nuevofuncion);
    } catch (error) {
        console.error(error);
        res.status(500).json({messaje:'Error del server'})
    }

}
module.exports={
    CrearFuncionHander 
}
   
