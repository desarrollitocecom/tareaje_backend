const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Convocatoria = sequelize.define('Convocatoria', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        f_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        f_fin: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Convocatorias',
        timestamps: true
    });
    return Convocatoria;
};