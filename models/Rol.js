const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Rol = sequelize.define('Rol', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Roles',
        timestamps: true
    });
    return Rol;
};