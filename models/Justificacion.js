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
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Justificaciones',
        timestamps: true
    });

    Justificacion.associate = (db) => {
        // Relación con Asistencia
        Justificacion.belongsTo(db.Asistencia, {
            foreignKey: 'id_asistencia',
            as: 'asistencia', // Alias más claro
        });
    
        // Relación con Empleado
        Justificacion.belongsTo(db.Empleado, {
            foreignKey: 'id_dni',
            as: 'empleado', // Alias más claro
        });
    };




    return Justificacion;
};