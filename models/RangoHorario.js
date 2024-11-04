const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RangoHorario = sequelize.define('RangoHorario', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        inicio: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fin: {
            type: DataTypes.INTEGER,
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
        tableName: 'RangosHorario',
        timestamps: true
    });
    return RangoHorario;
};