const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Usuario = sequelize.define('Usuario', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        usuario: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        contraseña: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            },
            unique: true 
        },
        token: {
            type: DataTypes.STRING(500), // Token
            allowNull: true
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Usuarios',
        timestamps: true
    });

    Usuario.associate = (db) => {

        Usuario.belongsTo(db.Empleado, {
            foreignKey: {
                name: 'id_dni',
                allowNull: false,
                unique: true // Asegura que cada usuario solo pueda tener un empleado
            },
            as: 'empleado',
        });

        db.Empleado.hasOne(db.Usuario, {
            foreignKey: {
                name: 'id_dni',
                allowNull: true,
            },
            as: 'usuario'
        });

        Usuario.belongsTo(db.Rol, {
            foreignKey: {
                name: 'id_rol',
                allowNull: false
            },
            as: 'rol'
        });

    };



    return Usuario;
};