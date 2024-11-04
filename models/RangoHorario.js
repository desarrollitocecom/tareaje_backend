const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RangoHorario = sequelize.define('Funcion', {
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
        id_subgerencia: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Cargos', // Nombre de la tabla referenciada
                key: 'id_subgerencia'
            }
        }
    }, {
        tableName: 'RangosHorario',
        timestamps: true
    });
    return RangoHorario;
};