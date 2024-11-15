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
        Permiso.belongsToMany(db.Rol, {
            through: 'Roles_Permisos',      // Nombre de la tabla intermedia
            foreignKey: 'id_permiso',       // Nombre de la clave foránea para Permiso
            otherKey: 'id_rol',             // Nombre de la clave foránea para Rol
            as: 'roles'
        });
    };

    return Permiso;


    
};
