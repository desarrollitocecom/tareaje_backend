const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Permiso = sequelize.define('Permiso', {
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
        tableName: 'Permisos',
        timestamps: true
    });

    Permiso.associate = (db) => {
        // Relación muchos a muchos con Roles
        Permiso.belongsToMany(db.Rol, {
            through: 'Roles_Permisos',
            foreignKey: 'id_permiso',
            as: 'roles'
        });
    };


    return Permiso;
};