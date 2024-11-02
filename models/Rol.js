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
        Rol.belongsToMany(db.Permiso, {
            through: 'Roles_Permisos',      // Nombre de la tabla intermedia
            foreignKey: 'id_rol',           // Nombre de la clave foránea para Rol
            otherKey: 'id_permiso',         // Nombre de la clave foránea para Permiso
            as: 'permisos'
        });

        Rol.hasMany(db.Usuario, { foreignKey: 'id_rol', as: 'usuarios' });
    };

    return Rol;
};
