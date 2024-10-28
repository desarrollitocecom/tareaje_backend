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

        Rol.associate = (db) => {
            Rol.belongsToMany(db.Permiso, {
                through: 'Roles_Permisos',
                foreignKey: 'id_rol',
                as: 'permisos'
            });
        
            Rol.hasMany(db.Usuario, { foreignKey: 'id_rol', as: 'usuarios' });
        };
        
        db.Permiso.associate = (db) => {
            Permiso.belongsToMany(db.Rol, {
                through: 'Roles_Permisos',
                foreignKey: 'id_permiso',
                as: 'roles'
            });
        };
        

    }

    return Rol;
};