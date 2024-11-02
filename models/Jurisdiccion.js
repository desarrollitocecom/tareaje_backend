const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Jurisdiccion = sequelize.define('Jurisdiccion', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Jurisdicciones',
        timestamps: true
    });
    return Jurisdiccion;
};