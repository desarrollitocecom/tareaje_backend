const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

    const Horario = sequelize.define('Horario', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        inicio: {
            type: DataTypes.TIME,
            allowNull: false
        },
        fin: {
            type: DataTypes.TIME,
            allowNull: false
        },
        id_subgerencia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: { model: 'Subgerencias', key: 'id' }
        },
        id_turno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: { model: 'Turnos', key: 'id' }
        },
        id_area: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: { model: 'Areas', key: 'id' }
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },{
        tableName: 'Horarios',
        timestamps: true
    });

    Horario.associate = (models) => {
        Horario.belongsTo(models.Subgerencia, { foreignKey: 'id_subgerencia', as: 'subgerencia' });
        Horario.belongsTo(models.Turno, { foreignKey: 'id_turno', as: 'turno' });
        Horario.belongsTo(models.Area, { foreignKey: 'id_area', as: 'area' });
    };

    return Horario;
};