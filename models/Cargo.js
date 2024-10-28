const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Cargo = sequelize.define('Cargo', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sueldo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_subgerencia: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Subgerencias', // Nombre de la tabla referenciada
                key: 'id',
            }
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Cargos',
        timestamps: true
    });

    Cargo.associate = (db) => {
        Cargo.belongsToMany(db.Empleado, {
            through: 'Empleado_Cargos', // Nombre de la tabla intermedia
            foreignKey: 'id_cargo', // Clave foránea en la tabla intermedia
            otherKey: 'id_empleado', // Clave foránea del otro modelo en la tabla intermedia
            as: 'empleados', // Alias para acceder a los empleados desde un cargo
        });}

    return Cargo;
};
