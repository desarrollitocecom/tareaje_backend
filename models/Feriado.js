const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Feriado = sequelize.define('Feriado', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha:{
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'Feriados',
        timestamps: true
    });

    return Feriado;
};