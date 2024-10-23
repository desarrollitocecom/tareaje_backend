const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RegimenLaboral = sequelize.define('RegimenLaboral', {
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
    },{
        tableName: 'RegimenLaborales',
        timestamps: true
    });

    return RegimenLaboral;
};