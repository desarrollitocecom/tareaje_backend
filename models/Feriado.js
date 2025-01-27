const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Feriado = sequelize.define('Feriado', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        id_feriado_tipo: {
            type: DataTypes.INTEGER, allowNull: false,
            references: { model: 'FeriadoTipos', key: 'id' }
        },
    },{
        tableName: 'Feriados',
        timestamps: true
    });

    Feriado.associate = (db) => {
        Feriado.belongsTo(db.FeriadoTipo, { foreignKey: 'id_feriado_tipo', as: 'feriadoTipo' });
    };

    return Feriado;
};
