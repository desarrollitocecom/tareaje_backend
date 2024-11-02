const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Sexo= sequelize.define('Sexo', {
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
    },{
        tableName: 'Sexos',
        timestamps: true
    });
    return Sexo;
};