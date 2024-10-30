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
        observacion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_empleado: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    },{
        tableName: 'Descansos',
        timestamps: true
    });
    

    return Descanso;
};
