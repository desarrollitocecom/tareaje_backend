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
<<<<<<< HEAD
        photo_id: {
            type: DataTypes.STRING,
            allowNull: false,
=======
        foto: {
            type: DataTypes.STRING,
            allowNull: false
>>>>>>> db748e976881fce521a3d8c6583df515361695e9
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
        },
        photo_id:{
            type: DataTypes.STRING,
            allowNull: false
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
