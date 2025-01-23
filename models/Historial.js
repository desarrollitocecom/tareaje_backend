const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Historial = sequelize.define('Historial', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        accion: {
            type: DataTypes.ENUM('create', 'update', 'delete', 'read'),
            allowNull: false
        },
        modelo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        valor_previo: {
            type: DataTypes.JSON,
            allowNull: true
        },
        valor_nuevo: {
            type: DataTypes.JSON,
            allowNull: true
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },{
        tableName: 'Historiales',
        timestamps: true
    });

    Historial.associate = (db) => {
        Historial.belongsTo(db.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
    };

    return Historial;
};