const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PruebaRespuesta = sequelize.define('PruebaRespuesta', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        E: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        M: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        J: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        I: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        S: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        A: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        B: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        T: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        SE: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        O1: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        O2: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        O3: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },{
        tableName: 'PruebaRespuestas',
        timestamps: false
    });
    return PruebaRespuesta;
};