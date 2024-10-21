const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Historial = sequelize.define('Historial', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    }, {
        tableName: 'Historiales',
        timestamps: true
    });
    return Historial;
};