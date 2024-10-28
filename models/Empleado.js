const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Empleado = sequelize.define('Empleado', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombres: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellidos: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dni: {
            type: DataTypes.STRING(8),
            allowNull: false,
            unique: true
        },
        ruc: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_cargo: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Cargos',
                key: 'id',
            }
        },
        id_turno: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Turnos',
                key: 'id',
            }
        },
        id_regimen_laboral: {
            type: DataTypes.INTEGER,
            references: {
                model: 'RegimenLaborales',
                key: 'id',
            }
        },
        id_sexo: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Sexos',
                key: 'id',
            }
        },
        id_jurisdiccion: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Jurisdicciones',
                key: 'id',
            }
        },
        id_grado_estudios: {
            type: DataTypes.INTEGER,
            references: {
                model: 'GradoDeEstudios',
                key: 'id',
            }
        },
        id_subgerencia: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Subgerencias',
                key: 'id',
            }
        },
        id_funcion: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Funciones',
                key: 'id',
            }
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Empleados',
        timestamps: true
    });

    return Empleado;
};
