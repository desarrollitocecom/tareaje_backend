const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const BlackList = sequelize.define('BlackList', {
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
        motivo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        f_fin: {
            type: DataTypes.DATEONLY,
            allowNull: false
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
        }
    },{
        tableName: 'BlackList',
        timestamps: true
    });

    BlackList.associate = (db) => {
        BlackList.belongsTo(db.Cargo, { foreignKey: 'id_cargo', as: 'cargo' });
        BlackList.belongsTo(db.Turno, { foreignKey: 'id_turno', as: 'turno' });
        BlackList.belongsTo(db.RegimenLaboral, { foreignKey: 'id_regimen_laboral', as: 'regimenLaboral' });
        BlackList.belongsTo(db.Sexo, { foreignKey: 'id_sexo', as: 'sexo' });
        BlackList.belongsTo(db.Jurisdiccion, { foreignKey: 'id_jurisdiccion', as: 'jurisdiccion' });
        BlackList.belongsTo(db.GradoEstudios, { foreignKey: 'id_grado_estudios', as: 'gradoEstudios' });
        BlackList.belongsTo(db.Subgerencia, { foreignKey: 'id_subgerencia', as: 'subgerencia' });
        BlackList.belongsTo(db.Funcion, { foreignKey: 'id_funcion', as: 'funcion' });
        BlackList.belongsTo(db.LugarTrabajo, { foreignKey: 'id_lugar_trabajo', as: 'lugarTrabajo' });
        BlackList.belongsTo(db.Area, { foreignKey: 'id_area', as: 'area' });
    };

    return BlackList;
};
