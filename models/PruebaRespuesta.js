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
            allowNull: false
        },
        M: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        J: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        I: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        S: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        A: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        B: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        T: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        SE: {
            type: DataTypes.TEXT,
            allowNull: false
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