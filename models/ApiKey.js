const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ApiKey = sequelize.define('ApiKey', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        key: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
            validate: {
                len: [64, 64] // Garantiza que la clave tenga exactamente 64 caracteres
            }
        },
        app_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Roles', // Nombre de la tabla referenciada
                key: 'id', // Clave referenciada
            }
        },
        revoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'ApiKeys',
        timestamps: true,
        underscored: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });

    ApiKey.associate = (models) => {
        ApiKey.belongsTo(models.Rol, {
            foreignKey: 'id_rol',
            as: 'rol'
        });
    }

    return ApiKey;
};