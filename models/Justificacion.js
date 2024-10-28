const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Justificacion = sequelize.define('Justificacion', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        documentos: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_asistencia: {
            type: DataTypes.UUID,
            references: {
                model: 'Asistencias',
                key: 'id',
            }
        },
        id_empleado: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Empleados',
                key: 'id',
            }
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Justificaciones',
        timestamps: true
    });

    return Justificacion;
};
