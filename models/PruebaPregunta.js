const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PruebaPregunta = sequelize.define('PruebaPregunta', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pregunta: {
            type: DataTypes.STRING,
            allowNull: false
        },
        grupo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_por_grupo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        max_state: {
            type: DataTypes.ENUM('D','I','S','C','N'),
            allowNull: true
        },
        min_state: {
            type: DataTypes.ENUM('D','I','S','C','N'),
            allowNull: true
        }
    },{
        tableName: 'PruebaPreguntas',
        timestamps: false
    });
    return PruebaPregunta;
};