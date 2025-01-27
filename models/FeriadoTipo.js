const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const FeriadoTipo = sequelize.define('FeriadoTipo', {
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
        tableName: 'FeriadoTipos',
        timestamps: true
    });

    return FeriadoTipo;
};
