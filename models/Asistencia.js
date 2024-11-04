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
        photo_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM('A', 'J', 'D', 'F', 'V', 'NA'),
            allowNull: false,
        },
        id_empleado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Empleados', // Nombre de la tabla referenciada
                key: 'id', // Clave referenciada
            }
        }
    }, {
        tableName: 'Asistencias',
        timestamps: true,
        indexes: [
            { name: 'idx_asistencia_fecha', fields: ['fecha'] },
            { name: 'idx_asistencia_id_empleado', fields: ['id_empleado'] },
            { name: 'idx_asistencia_fecha_id_empleado', fields: ['fecha', 'id_empleado'] },
        ],
    });

    return Asistencia;
};
