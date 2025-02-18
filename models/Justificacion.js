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
            type: DataTypes.ENUM('A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF','T'),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        f_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        f_fin: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        id_empleado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model:'Empleados', key: 'id' }
        },
        estado_inicial: {
            type: DataTypes.ENUM('A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF','T'),
            allowNull: true
        }
    }, {
        tableName: 'Justificaciones',
        timestamps: true
    });

    Justificacion.associate = (db) => {
        Justificacion.belongsTo(db.Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
        Justificacion.belongsToMany(db.Asistencia, {
            through: 'Justificacion_Asistencia',
            foreignKey: 'id_justificacion',
            otherKey: 'id_asistencia',
            as: 'asistencias'
        })
    };

    return Justificacion;
};
