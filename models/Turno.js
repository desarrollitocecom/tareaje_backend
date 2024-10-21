const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Turno = sequelize.define('Turno', {
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
        tableName: 'Turnos',
        timestamps: true
    });

    return Turno;
};