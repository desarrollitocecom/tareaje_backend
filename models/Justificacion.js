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
            allowNull: true
        },
        tipo: {
            type: DataTypes.ENUM('A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF'),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        f_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        f_fin: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        ids_asistencia: {
            type: DataTypes.ARRAY(DataTypes.UUID),
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
        Justificacion.belongsTo(db.Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
    };

    return Justificacion;
};
