const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// Variables de entorno
const { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

// Configura la conexión a la base de datos
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false, // Desactiva los logs de Sequelize
});

const db = {};

// Función asíncrona para cargar y sincronizar modelos
const loadModels = async () => {
  const modelFiles = fs.readdirSync(path.join(__dirname, 'models'))
    .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js'); // Filtra solo archivos .js

  for (const file of modelFiles) {
    const model = require(path.join(__dirname, 'models', file))(sequelize);
    db[model.name] = model;
    console.log(`Modelo ${file} cargado`);
  }

  // Configurar asociaciones si los modelos tienen asociaciones
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
      console.log(`Asociaciones configuradas para: ${modelName}`);
    }
  });
};

// Ejecutar la función de carga de modelos
loadModels().then(() => {
  console.log('Todos los modelos han sido cargados y sincronizados.');
}).catch((err) => {
  console.error('Error al cargar y sincronizar los modelos:', err);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;