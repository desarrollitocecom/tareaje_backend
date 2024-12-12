const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RangoHorario = sequelize.define('RangoHorario', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        inicio: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        fin: {
            type: DataTypes.TIME,
            allowNull: false
        },
        ids_funcion: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'RangoHorarios',
        timestamps: true
    });

    RangoHorario.associate = (models) => {
        RangoHorario.belongsTo(models.Turno, { foreignKey: 'id_turno', as: 'turno' });
        RangoHorario.belongsTo(models.Subgerencia, { foreignKey: 'id_subgerencia', as: 'subgerencia' });
    };

    return RangoHorario;
};