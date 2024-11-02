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
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        id_subgerencia: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Subgerencias', // Nombre de la tabla referenciada
                key: 'id',
            }
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

    Cargo.associate = (db) => {
        Cargo.belongsTo(db.Subgerencia, {
            foreignKey: 'id_subgerencia', // Clave foránea
            as: 'Subgerencia' // Alias para la relación
        });
    };

    return Cargo;
};
