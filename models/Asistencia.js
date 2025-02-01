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
            type: DataTypes.ENUM('A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF'),
            allowNull: true
        },
        id_empleado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Empleados', key: 'id' }
        },
        photo_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        evidencia: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },{
        tableName: 'Asistencias',
        timestamps: true,
        indexes: [
            { name: 'idx_asistencia_fecha', fields: ['fecha'] },
            { name: 'idx_asistencia_id_empleado', fields: ['id_empleado'] },
            { name: 'idx_asistencia_fecha_id_empleado', fields: ['fecha', 'id_empleado'] },
        ],
    });

    Asistencia.associate = (models) => {
        Asistencia.belongsTo(models.Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
    };

    return Asistencia;
};
