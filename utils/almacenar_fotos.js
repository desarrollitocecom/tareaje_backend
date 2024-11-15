const fs = require('fs');
const path = require('path');
const os = require('os');

const { filePath } = process.env.FOTOS_RUTA;

function guardarFotoEmpleado (apellidos, nombres, dni, foto) {

    try {
        const fotoBuffer = Buffer.from(foto, 'base64');
        const fotoNombre = `${apellidos}_${nombres}_${dni}.jpg`.replaceAll(' ','-');
        const fotoPath = path.join(filePath, fotoNombre);

        fs.writeFileSync(fotoPath, fotoBuffer);
        console.log(`Imagen guardada en ${fotoPath}`);
        return fotoPath;
    } catch (error) {
        console.error("Error al decodificar la imagen en base64");
        return false;
    }
}

module.exports = {
    guardarFotoEmpleado
};
