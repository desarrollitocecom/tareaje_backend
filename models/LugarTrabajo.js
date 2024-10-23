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
        },
        state:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'LugarDeTrabajo',
        timestamps: true
    });
    return LugarTrabajo;
};