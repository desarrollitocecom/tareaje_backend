module.exports = (sequelize, DataTypes) => {
    const Cargo = sequelize.define('Cargo', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'Cargos',
      timestamps: false
    });
  
    return Cargo;

  };