module.exports = (sequelize, DataTypes) => {
    const Asistencia = sequelize.define('Asistencia', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM('A', 'T', 'F'),
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
            as: 'empleado',
        });
    };

    return Asistencia;
};