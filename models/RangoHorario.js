const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RangoHorario = sequelize.define('RangoHorario', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        inicio: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        fin: {
            type: DataTypes.TIME,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        id_cargo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Cargos', // Nombre de la tabla referenciada
                key: 'id'
            }
        },
        id_turno: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Turnos', // Nombre de la tabla referenciada
                key: 'id'
            }
        }
    }, {
        tableName: 'RangoHorarios',
        timestamps: true
    });

    RangoHorario.associate = (models) => {
        RangoHorario.belongsTo(models.Cargo, { foreignKey: 'id_cargo', as: 'cargo' });
        RangoHorario.belongsTo(models.Turno, { foreignKey: 'id_turno', as: 'turno' });
    };

    return RangoHorario;
};