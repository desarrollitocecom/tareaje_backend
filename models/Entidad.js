const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Entidad = sequelize.define('Entidad', {
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
        tableName: 'Entidades',
        timestamps: true
    });
    return Entidad;
};