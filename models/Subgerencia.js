const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Subgerencia = sequelize.define('Subgerencia', {
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
        tableName: 'Subgerencias',
        timestamps: true
    });
    return Subgerencia;
};