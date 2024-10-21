const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Asistencia = sequelize.define('Asistencia', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        hora: {
            type: DataTypes.TIME,
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('A', 'J', 'D', 'F', 'V', 'NA'),
            allowNull: false,
        },
    }, {
        tableName: 'Asistencias',
        timestamps: true,
    });

    // Definir la asociación de Asistencia con Empleado
    Asistencia.associate = (db) => {
        Asistencia.belongsTo(db.Empleado, {
            foreignKey: 'id_dni',
            as: 'id_empleado',
        });
    };

    return Asistencia;
};