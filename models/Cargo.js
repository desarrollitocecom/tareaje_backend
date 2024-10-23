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
        state:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'Cargos',
        timestamps: true
    });

    // Definir la asociación de Asistencia con Empleado
    Cargo.associate = (db) => {
        Cargo.belongsTo(db.Subgerencia, {
            foreignKey: 'id_subgerencia', // Esto sería más adecuado
            as: 'Subgerencia', // Alias más claro
        });
    };

    return Cargo;

};