const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Descanso = sequelize.define('Descanso', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        observacion: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{
        tableName: 'Descansos',
        timestamps: true
    });

    Descanso.associate = (db) => {
        Descanso.belongsTo(db.Empleado, {
            foreignKey: 'id_dni',
            as: 'empleado', // Alias más claro
        });
    };

    return Descanso;
};