const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const GradoEstudios = sequelize.define('GradoEstudios', {
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
        tableName: 'GradoDeEstudios',
        timestamps: true
    });
    return GradoEstudios;
};