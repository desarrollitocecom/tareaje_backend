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
        campo:{
            type: DataTypes.STRING,
            allowNull: true
        },
        valor_anterior: {
            type: DataTypes.STRING,
            allowNull: true
        },
        valor_nuevo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Historiales',
        timestamps: true
    });

    Historial.associate = (db) => {
        // Relación con la tabla Cargo
        Historial.belongsTo(db.Usuario, {
            foreignKey: 'id_usuario',
            as: 'usuario'
        });
    
        db.Historial.hasOne(Historial, {
            foreignKey: 'id_usuario',
            as: 'historia'
        })
    }


    return Historial;
};