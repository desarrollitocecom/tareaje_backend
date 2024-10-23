const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Funcion = sequelize.define('Funcion', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'Funciones',
        timestamps: true
    });
    return Funcion;
};