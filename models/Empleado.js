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
        hijos: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        edad: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        f_nacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        domicilio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        celular: {
            type: DataTypes.STRING,
            allowNull: true
        },
        f_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        foto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        carrera: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_cargo: {
            type: DataTypes.INTEGER,
            references: {
                model:'Cargos',
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
        id_lugar_trabajo:{
            type:DataTypes.INTEGER,
            references:{
                model:'LugarDeTrabajo',
                key:'id'
            }

        },
        id_funcion: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Funciones',
                key: 'id'
            }
        },
        id_area: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Areas',
                key: 'id'
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

    Empleado.associate = (db) => {
        Empleado.belongsTo(db.Cargo, { foreignKey: 'id_cargo', as: 'cargo' });
        Empleado.belongsTo(db.Turno, { foreignKey: 'id_turno', as: 'turno' });
        Empleado.belongsTo(db.RegimenLaboral, { foreignKey: 'id_regimen_laboral', as: 'regimenLaboral' });
        Empleado.belongsTo(db.Sexo, { foreignKey: 'id_sexo', as: 'sexo' });
        Empleado.belongsTo(db.Jurisdiccion, { foreignKey: 'id_jurisdiccion', as: 'jurisdiccion' });
        Empleado.belongsTo(db.GradoEstudios, { foreignKey: 'id_grado_estudios', as: 'gradoEstudios' });
        Empleado.belongsTo(db.Subgerencia, { foreignKey: 'id_subgerencia', as: 'subgerencia' });
        Empleado.belongsTo(db.Funcion, { foreignKey: 'id_funcion', as: 'funcion' });
        Empleado.belongsTo(db.LugarTrabajo, { foreignKey: 'id_lugar_trabajo', as: 'lugarTrabajo' });
        Empleado.belongsTo(db.Area, { foreignKey: 'id_area', as: 'area'});
        Empleado.hasMany(db.Asistencia, { foreignKey: 'id_empleado', as: 'asistencias' });
        Empleado.hasMany(db.Descanso, { foreignKey: 'id_empleado', as: 'descansos' });
        Empleado.hasMany(db.Justificacion, { foreignKey: 'id_empleado', as: 'justificaciones' });
        Empleado.hasMany(db.Vacacion, { foreignKey: 'id_empleado', as: 'vacaciones' });
        Empleado.hasOne(db.Pago, { foreignKey: 'id_empleado', as: 'pago'});
    };

    return Empleado;
};
