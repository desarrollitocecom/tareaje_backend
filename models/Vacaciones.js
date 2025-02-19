const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Vacacion = sequelize.define('Vacacion', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        f_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        f_fin:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        state:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        before: {
            type: DataTypes.JSONB,
            allowNull: true
        }
    }, {
        tableName: 'Vacaciones',
        timestamps: true
    });

    Vacacion.associate = (db) => {
        Vacacion.belongsTo(db.Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
    };
    
    return Vacacion;
};