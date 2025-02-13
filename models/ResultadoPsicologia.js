const { DataTypes } = require("sequelize");
const { defaultValueSchemable } = require("sequelize/lib/utils");

module.exports = (sequelize) => {
    const ResultadoPsicologia = sequelize.define('ResultadoPsicologia', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        respuestas: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        id_prueba: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: { model: 'PruebaRespuestas', key: 'id' }
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
        ResultadoPsicologia.belongsTo(models.PruebaRespuesta, { foreignKey: 'id_prueba', as: 'prueba' });
    };

    return ResultadoPsicologia;
};