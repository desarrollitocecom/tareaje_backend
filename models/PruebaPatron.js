const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PruebaPatron = sequelize.define('PruebaPatron', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        patron: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_respuesta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: { model: 'PruebaRespuestas', key: 'id' }
        }
    },{
        tableName: 'PruebaPatrones',
        timestamps: false
    });

    PruebaPatron.associate = (models) => {
        PruebaPatron.belongsTo(models.PruebaRespuesta, { foreignKey: 'id_respuesta', as: 'respuesta' });
    };

    return PruebaPatron;
};