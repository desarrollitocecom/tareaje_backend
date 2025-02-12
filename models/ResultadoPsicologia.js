const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ResultadoPsicologia = sequelize.define('ResultadoPsicologia', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        respuestas: {
            type: DataTypes.JSON,
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
        },
        id_postulante: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: { model: 'Postulantes', key: 'id' }
        },
        state_accept: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        }
    },{
        tableName: 'ResultadoPsicologia',
        timestamps: true
    });

    ResultadoPsicologia.associate = (models) => {
        ResultadoPsicologia.belongsTo(models.Postulante, { foreignKey: 'id_postulante', as: 'postulante' });
    };

    return ResultadoPsicologia;
};