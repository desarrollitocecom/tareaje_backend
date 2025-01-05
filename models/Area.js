const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Area = sequelize.define('Area', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Areas',
        timestamps: true
    });
    return Area;
};