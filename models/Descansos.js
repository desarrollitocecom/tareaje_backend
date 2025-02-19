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
        tipo: {
            type: DataTypes.ENUM('DL','DO','DC'),
            allowNull: false
        },
        observacion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_empleado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Empleados', key: 'id' }
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        before: {
            type: DataTypes.ENUM('A','F','DO','DL','DC','LF', 'NA','DM','LSG','LCG','SSG','V','R','DF','T'),
            allowNull: true
        }
    },{
        tableName: 'Descansos',
        timestamps: true
    });

    Descanso.associate = (models) => {
        Descanso.belongsTo(models.Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
    };

    return Descanso;
};
