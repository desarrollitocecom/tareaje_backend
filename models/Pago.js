const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Pago = sequelize.define('Pago', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        carasDni: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cci: {
            type: DataTypes.STRING,
            allowNull: false
        },
        certiAdulto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        claveSol: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_empleado: {
            type: DataTypes.INTEGER,
            references: {
                model:'Empleados',
                key: 'id',
            }
        }
    },{
        tableName: 'Pagos',
        timestamps: true
    });

    Pago.associate = (db) => {
        Pago.belongsTo(db.Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
    };

    return Pago;
};
