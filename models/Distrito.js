const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Distrito = sequelize.define('Distrito', {
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
        tableName: 'Distritos',
        timestamps: true
    });
    return Distrito;
};