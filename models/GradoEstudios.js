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
           
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'GradoDeEstudios',
        timestamps: true
    });
    return GradoEstudios;
};