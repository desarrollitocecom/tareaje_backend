const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Rol = sequelize.define('Rol', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Roles',
        timestamps: true
    });
    Rol.associate = (db) => {

        Rol.hasMany(db.Usuario, {
            foreignKey: 'id_rol', // Esto referencia el campo en Usuario
            as: 'usuario'
        });
        
    }


    return Rol;
};