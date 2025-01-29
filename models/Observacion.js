const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Observacion = sequelize.define(
    "Observacion",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      comentario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      long: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fotos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      ubicacion: {
        type: DataTypes.STRING, // Campo agregado
        allowNull: true,
      },
      consultaStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'No especificado'
      },
      estado: {
        type: DataTypes.ENUM("ABIERTO", "CERRADO"),
        allowNull: false,
        defaultValue: "ABIERTO",
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Observaciones",
      timestamps: true,
    },
  );

  return Observacion;
};
