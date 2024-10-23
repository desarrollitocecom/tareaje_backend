const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const LugarTrabajo = sequelize.define('LugarTrabajo', {
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
        tableName: 'LugarDeTrabajo',
        timestamps: true
    });
    return LugarTrabajo;
};